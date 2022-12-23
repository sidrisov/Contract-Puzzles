const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const threshold = BigInt(0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf);

    let match = false;
    let wallet;
    
    while(!match) {
      wallet = await ethers.Wallet.createRandom();
      // add the provider from Hardhat
      wallet = await wallet.connect(ethers.provider);

      if (BigInt(`${await wallet.getAddress()}`) < threshold) {
        console.log(`Found matching wallet for the win: ${await wallet.getAddress()}`);
        await ethers.provider.getSigner(0).sendTransaction({to: wallet.address, value: ethers.utils.parseEther("1")});
        match = true;
      }
    }

    return { game, wallet };
  }
  it('should be a winner', async function () {
    const { game, wallet } = await loadFixture(deployContractAndSetVariables);

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
