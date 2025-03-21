import fs from "fs";
import { Addresses } from "./addresses.template";
import * as mustache from "mustache";

export let addresses: Addresses = {
  factoryAddress: "{{factoryAddress}}",
  network: "{{network}}",
  startBlock: "{{startBlock}}",
  isDeployFromFactory: true,
  contractAddress: "0x0000000000000000000000000000000000000000",
};

const main = (): void => {
  try {
    const config = JSON.parse(fs.readFileSync("./config/config.json", "utf8"));
    let output = JSON.parse(mustache.render(JSON.stringify(addresses), config));

    fs.writeFileSync(
      __dirname + "/generatedAddresses.json",
      JSON.stringify(output, null, 2)
    );
  } catch (error: any) {
    console.log(`Error saving artifacts: ${error.message}`);
  }
};
main();
