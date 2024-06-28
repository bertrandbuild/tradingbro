# Trading Bro contracts

Deployed on galadriel devnet: 0x9Cc7E153254237f08d743599AABBF13364e47417 with dev oracle : 0x68EC9556830AD097D661Df2557FBCeC166a0A075

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Deploy

```shell
forge create --rpc-url https://devnet.galadriel.com/ --gas-price 1000000000 --gas-limit 3000000 --private-key <your_private_key> src/ChatGpt.sol:ChatGpt --constructor-args 0x68EC9556830AD097D661Df2557FBCeC166a0A075
```

### Generate ABIs

```shell
forge build --silent && jq '.abi' contracts/out/ChatGpt.sol/ChatGpt.json
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
