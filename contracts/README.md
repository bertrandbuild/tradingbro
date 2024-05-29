# Trading Bro contracts

Deployed on galadriel devnet: 0xD0F7b22C973Ae7A685B3B920616451573b68ba20 with dev oracle : 0x4168668812C94a3167FCd41D12014c5498D74d7e

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
forge create --rpc-url "https://devnet.galadriel.com" --private-key <your_private_key> src/ChatGpt.sol:ChatGpt --constructor-args 0x4168668812C94a3167FCd41D12014c5498D74d7e
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
