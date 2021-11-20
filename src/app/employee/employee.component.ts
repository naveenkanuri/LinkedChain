declare let window: any;
import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import address from '../../../environment/contract-address.json';
import WorkEx from '../../../blockchain/artifacts/blockchain/contracts/WorkEx.sol/WorkEx.json';
import { DialogService } from '../services/dialog.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

// const ELEMENT_DATA: Experience[] = [
//   {
//     _expId: 1234,
//     _employeePublicKey: 'string',
//     _employeeId: 'string',
//     _projectTitle: 'string',
//     _designation: 'string',
//     _salary: 1234,
//     _startDate: 1234,
//     _endDate: 1234,
//     _employerPublicKey: 'string',
//     _status: 1234,
//     _employerComments: 'string',
//     _employeeComments: 'string',
//   },
// ];

interface Employee {
  _publicKey: string;
  _name: string;
  _id: number;
  _address: string;
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

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = [
    '_expId',
    '_employeePublicKey',
    '_employeeId',
    '_projectTitle',
    '_designation',
    '_salary',
    '_startDate',
    '_endDate',
    '_employerPublicKey',
    '_status',
    '_employerComments',
    '_employeeComments',
  ];
  public dataSource: Experience[];
  public EmployeeForm: FormGroup;
  public ExperienceForm: FormGroup;

  public signer: any = null;

  public workExContract: any;

  public isEmployeeRegistered: boolean = false;
  // @ts-ignore
  public employee: Employee = {};

  // @ts-ignore
  public newEmployee: Employee = {};
  //@ts-ignore
  public experience: Experience = {};

  //@ts-ignore
  public allExperiences: Experience[];
  public signerAddress: any;

  constructor(private dialogService: DialogService) {
    this.dataSource = [];
    this.EmployeeForm = new FormGroup({
      EmployeePublicKey: new FormControl(),
      EmployeeName: new FormControl(),
      EmployeeId: new FormControl(),
      EmployeeAddress: new FormControl(),
      EmployeePhone: new FormControl(),
    });

    this.ExperienceForm = new FormGroup({
      EmployerPublicKey: new FormControl(),
      EmployeeCompanyId: new FormControl(),
      ProjectTitle: new FormControl(),
      Designation: new FormControl(),
      Salary: new FormControl(),
      StartDate: new FormControl(),
      EndDate: new FormControl(),
      EmployeeComments: new FormControl(),
    });
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
    this.employee = await this.workExContract.getEmployeeDetails(
      this.signerAddress
    );
    if (
      this.employee._publicKey != '0x0000000000000000000000000000000000000000'
    ) {
      this.isEmployeeRegistered = true;
      this.allExperiences =
        await this.workExContract.getExperienceDetailsForEmployee(
          this.signerAddress
        );
      this.dataSource = this.allExperiences;
    }
  }

  openDialog() {
    console.log('hello', this.EmployeeForm);
    this.extractEmployeeDetails();
    this.dialogService.confirmDialog(
      this.newEmployee,
      ConfirmDialogType.EMPLOYEE
    );
  }

  extractEmployeeDetails() {
    this.newEmployee._publicKey =
      this.EmployeeForm.get('EmployeePublicKey')?.value;
    console.log('this.newEmployee._publicKey = ' + this.newEmployee._publicKey);

    this.newEmployee._name = this.EmployeeForm.get('EmployeeName')?.value;
    console.log('this.newEmployee._name = ' + this.newEmployee._name);

    this.newEmployee._address = this.EmployeeForm.get('EmployeeAddress')?.value;
    console.log('this.newEmployee._address = ' + this.newEmployee._address);

    this.newEmployee._phoneNumber =
      this.EmployeeForm.get('EmployeePhone')?.value;
    console.log(
      'this.newEmployee._phoneNumber = ' + this.newEmployee._phoneNumber
    );

    this.newEmployee._id = this.EmployeeForm.get('EmployeeId')?.value;
    console.log('this.newEmployee._id = ' + this.newEmployee._id);
  }

  async addEmployee() {
    this.extractEmployeeDetails();
    // console.log('To be added employee details = ' + this.employee.toString());

    // console.log('difference = '+ (new Date(this.experience._endDate).getTime() - new Date(this.experience._startDate).getTime()));
    const tx = await this.workExContract.addEmployeeDetails(this.newEmployee);

    await tx.wait();

    console.log('Added ' + this.employee.toString());

    // this.EmployeeForm.reset();
  }

  async addExperienceDetails() {
    // workex

    this.experience._expId = 0;
    this.experience._status = 0;
    this.experience._employerComments = '';
    this.experience._employeePublicKey = this.signerAddress;
    console.log(
      'this.experience._employeePublicKey = ' +
        this.experience._employeePublicKey
    );

    this.experience._employerPublicKey =
      this.ExperienceForm.get('EmployerPublicKey')?.value;
    console.log(
      'this.experience._employerPublicKey = ' +
        this.experience._employerPublicKey
    );

    this.experience._employeeId =
      this.ExperienceForm.get('EmployeeCompanyId')?.value;
    console.log('this.experience._employeeId = ' + this.experience._employeeId);

    this.experience._designation =
      this.ExperienceForm.get('Designation')?.value;
    console.log(
      'this.experience._designation = ' + this.experience._designation
    );

    this.experience._projectTitle =
      this.ExperienceForm.get('ProjectTitle')?.value;
    console.log(
      'this.experience._projectTitle = ' + this.experience._projectTitle
    );

    this.experience._salary = this.ExperienceForm.get('Salary')?.value;
    console.log('this.experience._salary = ' + this.experience._salary);

    this.experience._employeeComments =
      this.ExperienceForm.get('EmployeeComments')?.value;
    console.log(
      'this.experience._employeeComments = ' + this.experience._employeeComments
    );

    let startDate = this.ExperienceForm.get('StartDate')?.value;
    this.experience._startDate = new Date(startDate).getTime();
    console.log('this.experience._startDate' + this.experience._startDate);

    let endDate = this.ExperienceForm.get('EndDate')?.value;
    this.experience._endDate = new Date(endDate).getTime();

    if (this.experience._endDate - this.experience._startDate < 259200) {
      // less than a month
      // console.log('difference = ' + (endDate - startDate));
      alert('Start Date should be at least a month before End Date');
    }

    const tx = await this.workExContract.addExperience(this.experience);

    await tx.wait();

    console.log('Added Exp: ' + this.experience.toString());
  }
}
