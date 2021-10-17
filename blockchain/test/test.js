const { expect } = require("chai");

describe("WorkEx App", ()=> {
  let workEx, owner;
  let addresses;

  beforeEach(async ()=> {
    const workExContract = await ethers.getContractFactory("WorkEx");
    workEx = await workExContract.deploy();
    await workEx.deployed();

    [owner, ...addresses] = await ethers.getSigners();
  });

  describe("Deployment", ()=> {
  });

  describe("Add Employer", ()=> {

    it("should add employer", async () => {
      const employer = {
        _publicKey: owner.address,
        _id:1,
        _name:"employer1",
        _address:"moon",
        _url:"https://employer1.dummy",
        _phoneNumber:123123
      };
      // console.log('owner =' + owner.address);

      await workEx.connect(owner).addEmployerDetails(employer);
      let ans = await workEx.getEmployerDetails(owner.address);
      // console.log(ans._id);
      expect(ans._publicKey).to.equal(owner.address);
      expect(ans._id).to.equal(employer._id);
      expect(ans._name).to.equal(employer._name);
      expect(ans._address).to.equal(employer._address);
      expect(ans._url).to.equal(employer._url);
      expect(ans._phoneNumber).to.equal(employer._phoneNumber);

    });
  });

  describe("Add Employee", ()=> {

    it("should add employee", async () => {
      const employee = {
        _publicKey: owner.address,
        _id:1,
        _name:"employee1",
        _address:"mars",
        _phoneNumber:123123
      };

      await workEx.connect(owner).addEmployeeDetails(employee);
      let ans = await workEx.getEmployeeDetails(owner.address);
      // console.log(ans._id);
      expect(ans._publicKey).to.equal(owner.address);
      expect(ans._id).to.equal(employee._id);
      expect(ans._name).to.equal(employee._name);
      expect(ans._address).to.equal(employee._address);
      expect(ans._phoneNumber).to.equal(employee._phoneNumber);
    });
  });

  describe("Add Experience", ()=> {

    it("should add experience", async () => {
      // console.log('owner.address = ' + owner.address);
      const experience = {
        _expId: 123,
        _employeePublicKey: owner.address,
        _employeeId:"employee1@employer1",
        _projectTitle:"workEx",
        _designation:"CEO",
        _salary:90909,
        _startDate:0,
        _endDate:90009000,
        _status: 2,
        _employerPublicKey:"0x2F72317616Fb4F4B716F68dB18EDBB0656e6816f",
        _employerComments: "",
        _employeeComments: "hello employer1"
      };

      await workEx.connect(owner).addExperience(experience);

      let ans = await workEx.getExperienceDetailsForEmployee(experience._employeePublicKey);
      // console.log(ans);
      expect(ans[0]._expId).to.equal(0);
      expect(ans[0]._status).to.equal(0);
      expect(ans[0]._employerComments).to.equal(experience._employerComments);
      // expect(ans[0]._employeePublicKey).to.equal(experience._employeePublicKey);
      expect(ans[0]._employeeId).to.equal(experience._employeeId);
      expect(ans[0]._projectTitle).to.equal(experience._projectTitle);
      expect(ans[0]._designation).to.equal(experience._designation);
      expect(ans[0]._salary).to.equal(experience._salary);
      expect(ans[0]._startDate).to.equal(experience._startDate);
      expect(ans[0]._endDate).to.equal(experience._endDate);
      expect(ans[0]._employerPublicKey).to.equal(experience._employerPublicKey);
      expect(ans[0]._employeeComments).to.equal(experience._employeeComments);
    });
  });
});
