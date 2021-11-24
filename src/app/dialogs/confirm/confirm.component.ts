declare let window: any;

import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ethers } from 'ethers';
import address from 'environment/contract-address.json';
import WorkEx from 'blockchain/artifacts/blockchain/contracts/WorkEx.sol/WorkEx.json';
interface Employer {
  _publicKey: string;
  _id: number;
  _name: string;
  _address: string;
  _url: string;
  _phoneNumber: number;
}

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
  _startDate: string;
  _endDate: string;
  _employerPublicKey: string;
  _status: number;
  _employerComments: string;
  _employeeComments: string;
}

enum ConfirmDialogType {
  EMPLOYEE,
  EMPLOYER,
  EMPLOYEE_EXPERIENCE,
}

interface Data {
  _data: any;
  _confirmDialogType: ConfirmDialogType;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  // public employer: Employer;
  public signer: any = null;
  public workExContract!: ethers.Contract;

  public displayData: any;
  public displayDataType: ConfirmDialogType;
  public displayDataTypes = ConfirmDialogType;

  public newEmployer!: Employer;
  public newEmployee!: Employee;
  public newEmployeeExperience!: Experience;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data) {
    this.displayData = data._data;
    this.displayDataType = data._confirmDialogType;
    if (data._confirmDialogType === ConfirmDialogType.EMPLOYEE) {
      this.newEmployee = <Employee>data._data;
    } else if (data._confirmDialogType === ConfirmDialogType.EMPLOYER) {
      this.newEmployer = <Employer>data._data;
    } else if (data._confirmDialogType === ConfirmDialogType.EMPLOYEE_EXPERIENCE) {
      this.newEmployeeExperience = <Experience>data._data;
    }

  }
  
  async addEmployer() {
    try {
      const tx = await this.workExContract.addEmployerDetails(this.newEmployer);
      const err1 = await tx.wait();
      console.log('DATA HAS BEEN ADDED::: ' + this.data.toString());
    } catch (err: any) {
    
    }
  }

  async addEmployee() {
    try {
      const tx = await this.workExContract.addEmployeeDetails(this.newEmployee);
      const err1 = await tx.wait();
      console.log('Added ' + this.data.toString());
    } catch (err: any) {
      
    }
  }

  async addEmployeeExperience() {
    try {
      const tx = await this.workExContract.addExperience(this.newEmployeeExperience);
      const err1 = await tx.wait();
      console.log('Added ' + this.data.toString());
    } catch (err: any) {
    }
  }

  async ngOnInit() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    this.signer = provider.getSigner();
    console.log('confirm ka signer = ' + (await this.signer.getAddress()));
    
    this.workExContract = new ethers.Contract(
      address.workExContract,
      WorkEx.abi,
      this.signer
    );
    console.log(
      'workExContract in confirm = ' + (await this.workExContract.resolvedAddress)
    );
  }
}
