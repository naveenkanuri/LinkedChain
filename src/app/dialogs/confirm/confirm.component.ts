declare let window: any;

import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ethers } from 'ethers';
import address from 'environment/contract-address.json';
import WorkEx from 'blockchain/artifacts/blockchain/contracts/WorkEx.sol/WorkEx.json';
// import { Experience } from 'src/app/employer/employer.component.ts'
interface Employer {
  _publicKey: string;
  _id: number;
  _name: string;
  _address: string;
  _url: string;
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
  public workExContract: any;
  public signerAddress: any;

  private confirmDialogType: ConfirmDialogType;
  public displayData: any;
  public displayDataType: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Data) {
    this.confirmDialogType = data._confirmDialogType;
    this.displayData = data._data;
    if (data._confirmDialogType === ConfirmDialogType.EMPLOYEE) {
      this.displayDataType = true;
    }
    // employer;
  }
  async addEmployer() {
    const tx = await this.workExContract.addEmployerDetails(this.data);
    await tx.wait();

    console.log('DATA HAS BEEN ADDED::: ' + this.data.toString());
  }

  async addEmployee() {
    // console.log('To be added employee details = ' + this.employee.toString());

    // console.log('difference = '+ (new Date(this.experience._endDate).getTime() - new Date(this.experience._startDate).getTime()));
    const tx = await this.workExContract.addEmployeeDetails(this.data);

    await tx.wait();

    console.log('Added ' + this.data.toString());

    // this.EmployeeForm.reset();
  }
  async ngOnInit() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    console.log('on init');
    this.workExContract = new ethers.Contract(
      address.workExContract,
      WorkEx.abi,
      this.signer
    );
    this.signerAddress = await this.signer.getAddress();
  }
}
