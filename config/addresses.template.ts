export type Addresses = {
  factoryAddress: string;
  contractAddress : string
  startBlock: string;
  network: string;
  isDeployFromFactory: boolean;
  isERC7818: boolean
};

export let addresses: Addresses = {
  factoryAddress: "{{factoryAddress}}",
  contractAddress: "{{contractAddress}}",
  startBlock: "{{startBlock}}",
  network: "{{network}}",
  isDeployFromFactory: {{isDeployFromFactory}},
};
