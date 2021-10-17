const fs = require('fs');

async function main() {
  const WorkExContract = await ethers.getContractFactory("WorkEx");
  const workEx = await WorkExContract.deploy();
  await workEx.deployed();

  console.log("The WorkEx contract was deployed to: " + workEx.address);

  let address = {"workExContract" : workEx.address};
  let addressJSON = JSON.stringify(address);
  fs.writeFileSync("environment/contract-address.json", addressJSON);
}

main()
  .then(()=> {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })

