# Génération d'adresses de Bitcoin

- Comprendre la [cryptographie sur courbe elliptique](https://arstechnica.com/information-technology/2013/10/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/).
- [Modèle Sepc256k1](https://en.bitcoin.it/wiki/Secp256k1)

[Example](https://cdn.rawgit.com/andreacorbellini/ecc/920b29a/interactive/modk-add.html)

## Etape 1

Obtenir un nombre aléatoire sur 256 bits (32 bytes), nommé `k`.

## Etape 2

Obtenir la clé publique tel que Q = kG où `G` est le générateur de Secp256k1 et `k` la clé privée.

La clé publique correspond aux coordonnés (x,y) concaténés et sérialisés en hexadémical pour donner : hex(x).hex(y).

## Etape 3

Hasher la clé publique sérialisée avec SHA256 et hasher le résultat avec Ripemd160.

## Etape 4

Ajouter un byte (network ID) au résultat de l'étape 3 tel que :
- 0x00 pour le mainnet
- 0x6f pour le testnet

## Etape 5

SHA256d sur le résultat de l'étape 4 : double hash. Récupérer les 4 premiers bytes du résultat. Ce sera le `checksum`.

## Etape 6

Ajouter le `checksum` à la fin du résultat de l'étape 4. C'est la proto adresse.

## Etape 7

Encoder la proto adresse avec Base58. C'est l'adresse publique résultante.

# Wallet Import Format

Le Wallet Import Format ou WIF est une méthode simple pour compacter une valeur codée en 256 bits, typiquement la clé privée `k` et la rendre utilisable plus facilement.

Note : il existe plusieurs formats WIP, ici un seul est évoqué et c'est le plus courant.

# Etape 1

Récupérer la clé privée `k`.

# Etape 2

Ajouter un byte (network ID) au début de la clé privée :
- 0x80 pour le mainnet
- 0xef pour le testnet

# Etape 3

Hasher le résultat de l'étape 2 avec SHA256d (double SHA256). Récupérer les 4 premiers bytes, c'est le `checksum`.

# Etape 4

Ajouter le `checksum` à la fin du résultat de l'étape 2.

# Etape 5

Encoder le résultat de l'étape 4 avec Base58.
