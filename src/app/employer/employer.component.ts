declare let window: any;

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ethers } from 'ethers';
import address from '../../../environment/contract-address.json';
import WorkEx from '../../../blockchain/artifacts/blockchain/contracts/WorkEx.sol/WorkEx.json';
import { DialogService } from '../services/dialog.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
  _startDate: number;
  _endDate: number;
  _employerPublicKey: string;
  _status: number;
  _employerComments: string;
  _employeeComments: string;
}

enum ConfirmDialogType {
  EMPLOYEE,
  EMPLOYER,
}

enum ExperienceType {
  PENDING,
  APPROVED,
  REJECTED,
}

@Component({
  selector: 'app-employer',
  templateUrl: './employer.component.html',
  styleUrls: ['./employer.component.css'],
})
export class EmployerComponent implements OnInit {
  displayedColumns: string[] = [
    '_expId',
    '_employeePublicKey',
    '_employerPublicKey',
    '_employeeId',
    '_designation',
    '_salary',
    '_projectTitle',
    '_startDate',
    '_endDate',
    '_status',
    '_employerComments',
    '_employeeComments',
  ];
  public dataSource: Experience[];
  public EmployerForm: FormGroup;
  public signer: any = null;
  public isEmployerRegistered: boolean = false;

  public workExContract!: ethers.Contract;

  // @ts-ignore
  public employer: Employer = {};

  // @ts-ignore
  public newEmployer: Employer = {};

  // @ts-ignore
  public allExperiences: Experience[] = [];
  // @ts-ignore
  public pendingExperiences: Experience[] = [
    // Testing
    // {
    //   _expId: 12323,
    //   _employeePublicKey: '123213',
    //   _employeeId: '123213213',
    //   _projectTitle: 'kuchbhi',
    //   _designation: 'some',
    //   _salary: 123324324,
    //   _startDate: 234324324,
    //   _endDate: 234324324,
    //   _employerPublicKey: '34324324324',
    //   _status: 1,
    //   _employerComments: '12323',
    //   _employeeComments: '12321321S',
    // },
  ];
  // @ts-ignore
  public approvedExperiences: Experience[] = [];
  // @ts-ignore
  public rejectedExperiences: Experience[] = [];

  public signerAddress: any;

  public pendingExperiencesDataSource = new MatTableDataSource<Experience>();
  public approvedExperiencesDataSource = new MatTableDataSource<Experience>();
  public rejectedExperiencesDataSource = new MatTableDataSource<Experience>();

  public sort!: MatSort;

  public experienceType = ExperienceType;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.pendingExperiencesDataSource.sort = sort;
    this.approvedExperiencesDataSource.sort = sort;
    this.rejectedExperiencesDataSource.sort = sort;
  }

  constructor(private dialogService: DialogService) {
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

  setDataSources(pendingExperiences: Experience[], approvedExperiences: Experience[], rejectExperiences: Experience[]): void{
  
    this.pendingExperiencesDataSource.data = this.pendingExperiences;
    this.pendingExperiencesDataSource.sort = this.sort;
  
    this.approvedExperiencesDataSource.data = this.approvedExperiences;
    this.approvedExperiencesDataSource.sort = this.sort;

    this.rejectedExperiencesDataSource.data = this.rejectedExperiences;
    this.rejectedExperiencesDataSource.sort = this.sort;
  }

  public filterData(filterDataEvent: Event, experienceType: ExperienceType) {
    let filterDataValue = (<HTMLTextAreaElement>filterDataEvent.target).value;
    
    if (experienceType === ExperienceType.PENDING) {
      this.pendingExperiencesDataSource.filter = filterDataValue.trim().toLocaleLowerCase();
    } else if (experienceType === ExperienceType.APPROVED) {
      this.approvedExperiencesDataSource.filter = filterDataValue.trim().toLocaleLowerCase();
    } else if (experienceType === ExperienceType.REJECTED) {
      this.rejectedExperiencesDataSource.filter = filterDataValue.trim().toLocaleLowerCase();
    }
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
    this.employer = await this.workExContract.getEmployerDetails(
      this.signerAddress
    );
    console.log(this.employer._publicKey);
    console.log(parseInt(String(this.employer._id), 10));
    if (
      this.employer._publicKey != '0x0000000000000000000000000000000000000000'
    ) {
      this.isEmployerRegistered = true;
      this.allExperiences =
        await this.workExContract.getExperienceDetailsForEmployer(
          this.employer._publicKey
        );
      console.log('all experiences = ' + this.allExperiences);
      this.categorizeExperiences(this.allExperiences);
    
      this.setDataSources(this.pendingExperiences, this.approvedExperiences, this.rejectedExperiences);
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

  async approve(_expId: number, comments: string) {
    const tx = await this.workExContract.approveExperience(_expId, comments);
    tx.wait();
  }

  async reject(_expId: number, comments: string) {
    const tx = await this.workExContract.rejectExperience(_expId, comments);
    tx.wait();
  }
}

export class NgbdAccordionHeader {
  disabled = false;
}
