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

enum ConfirmDialogType {
  EMPLOYEE,
  EMPLOYER,
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
  public displayDataType: boolean = false;

  public newEmployer!: Employer;
  public newEmployee!: Employee;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data) {
    this.displayData = data._data;
    if (data._confirmDialogType === ConfirmDialogType.EMPLOYEE) {
      this.displayDataType = true;
      this.newEmployee = <Employee>data._data;
    } else if (data._confirmDialogType === ConfirmDialogType.EMPLOYER) {
      this.newEmployer = <Employer>data._data;
    }
  }
  
  async addEmployer() {
    try {
      const tx = await this.workExContract.addEmployerDetails(this.newEmployer);
      const err1 = await tx.wait();
      console.log('DATA HAS BEEN ADDED::: ' + this.data.toString());
    } catch (err: any) {
      console.log(err);
    }
  }

  async addEmployee() {
    try {
      const tx = await this.workExContract.addEmployeeDetails(this.newEmployee);
      const err1 = await tx.wait();
      console.log('Added ' + this.data.toString());
    } catch (err: any) {
      console.log(err);
    }
  }
  async ngOnInit() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    this.signer = provider.getSigner();
    console.log('confirm ka signer = ' + (await this.signer.getAddress()));
    console.log('on init');
    
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
