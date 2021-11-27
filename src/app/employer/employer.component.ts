declare let window: any;

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ethers } from 'ethers';
import address from '../../../environment/contract-address.json';
import WorkEx from '../../../blockchain/artifacts/blockchain/contracts/WorkEx.sol/WorkEx.json';
import { DialogService } from '../services/dialog.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

interface Employer {
  _publicKey: string;
  _id: number;
  _name: string;
  _address: string;
  _url: string;
  _phoneNumber: number;
}

interface Experience {
  _expId: number;
  _employeePublicKey: string;
  _employeeId: string;
  _projectTitle: string;
  _designation: string;
  _salary: number;
  _startDate: string;
  _endDate: string;
  _status: number;
  _employerComments: string;
  _employeeComments: string;
  _employerPublicKey: string;
}

interface Employee {
  _publicKey: string;
  _name: string;
  _id: number;
  _address: string;
  _phoneNumber: number;
}

enum ConfirmDialogType {
  EMPLOYEE,
  EMPLOYER,
}

enum ExperienceType {
  PENDING,
  APPROVED,
  REJECTED,
  ALL_APPROVED,
}

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.css'],
})
export class EmployerComponent implements OnInit {
  displayedColumnsPending: string[] = [
    '_expId',
    '_employeePublicKey',
    '_employeeId',
    '_designation',
    '_salary',
    '_projectTitle',
    '_startDate',
    '_endDate',
    '_employeeComments',
    '_employerCommentsNew',
    'approve',
    'reject'
  ];
  displayedColumns: string[] = [
    '_expId',
    '_employeePublicKey',
    '_employeeId',
    '_designation',
    '_salary',
    '_projectTitle',
    '_startDate',
    '_endDate',
    '_employerComments',
    '_employeeComments'
  ];
  displayedColumnsAllApproved: string[] = [
    '_expId',
    '_employeePublicKey',
    '_employerPublicKey',
    '_designation',
    '_startDate',
    '_endDate',
  ];
  public dataSource: Experience[];
  public EmployerForm: FormGroup;
  public signer: any = null;
  public isEmployerRegistered: boolean = false;

  public comments: string[] = [];

  public workExContract!: ethers.Contract;

  // @ts-ignore
  public employer: Employer = {};
  // @ts-ignore
  public employee: Employee = {};

  // @ts-ignore
  public newEmployer: Employer = {};

  // @ts-ignore
  public allExperiencesForEmployer: Experience[] = [];
  // @ts-ignore
  public pendingExperiences: Experience[] = [];
  // @ts-ignore
  public approvedExperiences: Experience[] = [];
  // @ts-ignore
  public rejectedExperiences: Experience[] = [];
  // @ts-ignore
  public allExperiences: Experience[] = [];

  public signerAddress: any;

  public pendingExperiencesDataSource!: MatTableDataSource<Experience>;
  public approvedExperiencesDataSource!: MatTableDataSource<Experience>;
  public rejectedExperiencesDataSource!: MatTableDataSource<Experience>;
  public allExperiencesDataSource!: MatTableDataSource<Experience>;

  public experienceType = ExperienceType;

  @ViewChild('pendingExperiencesSortFun') pendingExperiencesSortFun!: MatSort;
  @ViewChild('approvedExperiencesSortFun') approvedExperiencesSortFun!: MatSort;
  @ViewChild('rejectedExperiencesSortFun') rejectedExperiencesSortFun!: MatSort;
  @ViewChild('allExperiencesSortFun') allExperiencesSortFun!: MatSort;

  constructor(private dialogService: DialogService, private router: Router) {
    this.dataSource = [];

    this.EmployerForm = new FormGroup({
      EmployerPublicKey: new FormControl(),
      EmployerUniqueId: new FormControl(),
      EmployerName: new FormControl(),
      EmployerAddress: new FormControl(),
      EmployerPhone: new FormControl(),
      EmployerURL: new FormControl(),
    });
  }

  setDataSources(): void{
  
    this.pendingExperiencesDataSource = new MatTableDataSource(this.pendingExperiences);

    this.approvedExperiencesDataSource = new MatTableDataSource(this.approvedExperiences);

    this.rejectedExperiencesDataSource = new MatTableDataSource(this.rejectedExperiences);

    this.allExperiencesDataSource = new MatTableDataSource(this.allExperiences);
  }

  setSort(): void {
    setTimeout(() => {
      this.pendingExperiencesDataSource.sort = this.pendingExperiencesSortFun;

      this.approvedExperiencesDataSource.sort = this.approvedExperiencesSortFun;
  
      this.rejectedExperiencesDataSource.sort = this.rejectedExperiencesSortFun;
  
      this.allExperiencesDataSource.sort = this.allExperiencesSortFun;
    }, 4000);
  }

  public filterData(filterDataEvent: Event, experienceType: ExperienceType) {
    let filterDataValue = (<HTMLTextAreaElement>filterDataEvent.target).value;
    
    if (experienceType === ExperienceType.PENDING) {
      this.pendingExperiencesDataSource.filter = filterDataValue.trim().toLocaleLowerCase();
    } else if (experienceType === ExperienceType.APPROVED) {
      this.approvedExperiencesDataSource.filter = filterDataValue.trim().toLocaleLowerCase();
    } else if (experienceType === ExperienceType.REJECTED) {
      this.rejectedExperiencesDataSource.filter = filterDataValue.trim().toLocaleLowerCase();
    } else if (experienceType == ExperienceType.ALL_APPROVED) {
      this.allExperiencesDataSource.filter = filterDataValue.trim().toLocaleLowerCase();
    }
  }

  filterAllExperiences() {
    let filteredAllExperiences = [];

    for (let i = 0; i < this.allExperiences.length; i++) {
      if (this.allExperiences[i]._status === 1) {
        filteredAllExperiences.push(this.allExperiences[i]);
      }
    }

    this.allExperiences = filteredAllExperiences;
  }

  async ngOnInit() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

    window.ethereum.on('accountsChanged', function(accounts: any) {
      window.location.reload();
    });

    provider.on('network', (newNetwork: any, oldNetwork: any) => {
      if (oldNetwork) {
        window.location.reload();
      }
    });

    this.signer = provider.getSigner();
    console.log('signer = ' + (await this.signer.getAddress()));

    if ((await this.signer.getChainId()) != 80001) {
      alert('Please change to mumbai test network!');
    }

    this.workExContract = new ethers.Contract(
      address.workExContract,
      WorkEx.abi,
      this.signer
    );
    console.log(
      'workExContract = ' + (await this.workExContract.resolvedAddress)
    );
    this.signerAddress = await this.signer.getAddress();

    this.employer = await this.workExContract.getEmployerDetails(this.signerAddress);
    this.employee = await this.workExContract.getEmployeeDetails(this.signerAddress);
    
    console.log(this.employer._publicKey);
    console.log(parseInt(String(this.employer._id), 10));

    // employer already registered
    if (this.employer._publicKey != '0x0000000000000000000000000000000000000000') {
      this.isEmployerRegistered = true;
      this.allExperiencesForEmployer = await this.workExContract.getExperienceDetailsForEmployer(this.employer._publicKey);
      this.categorizeExperiences(this.allExperiencesForEmployer);

      this.allExperiences = await this.workExContract.getAllExperiences(this.employer._publicKey);
      this.filterAllExperiences();

      this.setDataSources();
      this.setSort();

      // initialize comments
      for (let i = 0; i < this.pendingExperiences.length; i++) {
        this.comments.push("");
      }
    }

    // as employer this is not registered, but it is registered as employee
    else if (this.employee._publicKey != '0x0000000000000000000000000000000000000000') {
      this.router.navigate(['/employee']);
    }
  }

  openDialog() {
    console.log('hello', this.EmployerForm);
    this.extractEmployerDetails();
    this.dialogService.confirmDialog(
      this.newEmployer,
      ConfirmDialogType.EMPLOYER
    );
  }

  extractEmployerDetails() {
    this.newEmployer._publicKey =
      this.EmployerForm.get('EmployerPublicKey')?.value;
    console.log('this.employer._publicKey = ' + this.newEmployer._publicKey);

    this.newEmployer._id = this.EmployerForm.get('EmployerUniqueId')?.value;
    console.log('this.employer._id = ' + this.newEmployer._id);

    this.newEmployer._name = this.EmployerForm.get('EmployerName')?.value;
    console.log('this.employer._name = ' + this.newEmployer._name);

    this.newEmployer._address = this.EmployerForm.get('EmployerAddress')?.value;
    console.log('this.employer._address = ' + this.newEmployer._address);

    this.newEmployer._phoneNumber =
      this.EmployerForm.get('EmployerPhone')?.value;
    console.log(
      'this.employer._phoneNumber = ' + this.newEmployer._phoneNumber
    );

    this.newEmployer._url = this.EmployerForm.get('EmployerURL')?.value;
    console.log('this.employer._contactDetails = ' + this.newEmployer._url);

    console.log(
      'To be added employer details = ' + this.newEmployer.toString()
    );
  }

  // async addEmployer() {
  //   this.extractEmployerDetails();
  //   console.log("in employer " + JSON.stringify(this.newEmployer));

  //   const tx = await this.workExContract.addEmployerDetails(this.newEmployer);
  //   await tx.wait();

  //   console.log('Added ' + this.newEmployer.toString());

  //   // this.EmployerForm.reset();
  // }

  categorizeExperiences(experiences: Experience[]) {
    for (let exp of experiences) {
      if (exp._status == 0) {
        this.pendingExperiences.push(exp);
      } else if (exp._status == 1) {
        this.approvedExperiences.push(exp);
      } else {
        this.rejectedExperiences.push(exp);
      }
    }
  }

  // async approve(_expId: number) {
  //   const tx = await this.workExContract.approveExperience(_expId, this.comments);
  //   tx.wait();
  // }

  async approve(_expId: number, commentIndex: number) {
    const tx = await this.workExContract.approveExperience(_expId, this.comments[commentIndex]);
    const receipt = await tx.wait();
    window.location.reload();
  }

  // async reject(_expId: number) {
  //   const tx = await this.workExContract.rejectExperience(_expId, this.comments);
  //   tx.wait();
  // }

  async reject(_expId: number, commentIndex: number) {
    const tx = await this.workExContract.rejectExperience(_expId, this.comments[commentIndex]);
    const receipt = await tx.wait();
    window.location.reload();
  }
}

export class NgbdAccordionHeader {
  disabled = false;
}
