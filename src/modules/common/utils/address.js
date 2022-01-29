export const getAddress = async () => (await window.ethereum.enable())[0].toLowerCase();
