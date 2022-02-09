<p align="center">
  <a href="https://connect-phi.vercel.app/">
    <img src="https://i.imgur.com/EUlj7up.png" height="128">
    <h1 align="center">Phi</h1>
  </a>
</p>

<p align="center">
  <a aria-label="GitHub Release" href="https://github.com/robin-thomas/phi/releases">
    <img alt="" src="https://img.shields.io/github/v/release/robin-thomas/phi?labelColor=000&sort=semver&style=for-the-badge">
  </a>
  <a aria-label="Last Modified" href="https://github.com/robin-thomas/phi/releases">
    <img src="https://img.shields.io/github/release-date/robin-thomas/phi?style=for-the-badge&labelColor=000&color=red">
  </a>
  <a aria-label="License" href="https://github.com/robin-thomas/phi/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000&color=success">
  </a>
  <a aria-label="Join the community on GitHub" href="https://github.com/ipfs/community/discussions/717">
    <img alt="" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&labelColor=0000&logo=github&logoWidth=20">
  </a>
</p>

<p align="center">
  <img src="https://i.imgur.com/Q3Uu0Uo.png" height="500" />
</p>

## Contributing

#### Developing

The development branch is `main`. This is the branch that all pull requests should be made against. The changes on the `main` branch are published to GitHub release regularly.

To develop locally:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your
   own GitHub account and then
   [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch:
   ```sh
   git checkout -b MY_BRANCH_NAME
   ```
3. Install the dependencies with:
   ```sh
   npm ci
   ```
4. Start developing and watch for code changes:
   ```sh
   npm run dev
   ```
5. It will open a browser tab at `http://localhost:3000/`

#### Building

You can build the project, with:

```sh
npm run build
```
You can then serve the built files from a server, with:

```sh
mpm run start
```

#### Testing

```sh
npm run test
```

If you would like to see the coverage, you can do

```sh
npm run test:coverage
```

#### Linting

To check the formatting of your code:

```sh
npm run lint
```

## Authors
- Robin Thomas ([@robin-thomas](https://github.com/robin-thomas)]
