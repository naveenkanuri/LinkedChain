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

  constructor(@Inject(MAT_DIALOG_DATA) public data: Employer) {
    console.log('ji pls', data);
    // employer;
  }
  async addEmployer() {
    const tx = await this.workExContract.addEmployerDetails(this.data);
    await tx.wait();

    console.log('DATA HAS BEEN ADDED::: ' + this.data.toString());
  }
  async ngOnInit() {
    console.log('on init');
    this.workExContract = new ethers.Contract(
      address.workExContract,
      WorkEx.abi,
      this.signer
    );
    this.signerAddress = await this.signer.getAddress();
    // this.employer = await this.workExContract.getEmployerDetails(
    //   this.signerAddress
    // );
  }
}
