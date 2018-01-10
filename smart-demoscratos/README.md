# Smart Demoscratos

Démonstration d'un système de vote sous contrat intelligent avec Ethereum.

# Créer sa blockchain et son contrat

Nous allons considérer que le dossier utilisé par la blockchain sera `~/.ethereum_private`

## Initialiser le blockchain

- Installer [geth ou eth](https://www.ethereum.org/cli)
- Créer des adresses `geth account new --datadir ~/.ethereum_private`
- Configurer le fichier [genesis.json](./contract/genesis.json) et mettre les
adresse créées dans la partie `alloc`. Cela permet de donner des fonds à ces adresses
à des fins de tests.
- Initialiser le bloc génesis `geth init --datadir ~/.ethereum_private ./contract/genesis.json`
- Lancer la console `geth --fast --cache 512 --ipcpath ~/Library/Ethereum/geth.ipc --networkid 101 --rpc --rpcapi "web3,net,personal,eth" --rpccorsdomain "*" --datadir ~/.ethereum_private console`
- A partir de la console lancer le mineur `miner.start()`

## Construire le contrat Demoscratos

- Accéder à [Remix](https://remix.ethereum.org/)
- Copier coller [Demoscratos](./contract/demoscratos.sol) dans l'éditeur de Remix

### Remix

- Connecter Remix à son réseau privé avec l'onglet sur le panneau droit "Run" et sélectionner
le "environment" : Web3 Provider
- Renseigner l'adresse `http://localhost:8545` ou `http://127.0.0.1:8545` (si Remix se connecte bien au réseau
il devrait lister les addresses créées plus tôt)
- Exécuter le contrat avec le panneau droit, partie "Demoscratos", entrée "Create"
- Mettre en paramètre les propositions pour le vote sous forme de tableau de chaîne
de caractère, par exemple : `["candidat 1", "candidat 2"]`
- Donner le droit de vote à des adresses avec la méthode `giveRightToVote` et renseigner
les adresses en paramètre, par exemple : `["0x1d1854b047d59bbeff8e44fc5871031902b15251", "0x0503162c3f03cae6e1ae6613928f42a6a3d7b154"]`

Tout devrait être configuré. Maintenant sur le site [demoscratos](http://jonathan.blocs.xyz/smart-demoscratos/) tu peux
renseigner l'adresse de ton contrat avec l'adresse de ton réseau privé, le site
chargera les informations de ton contrat.

NOTE : Le site [demoscratos](http://jonathan.blocs.xyz/smart-demoscratos/) peut fonctionner
avec un contrat `demoscratos` publié sur le réseau mainnet de Ethereum, mais ça coutera du GAS donc
de la vraie valeur.
