# substrate

CircleCI: [![CircleCI](https://circleci.com/gh/jhuapl-boss/substrate/tree/master.svg?style=svg)](https://circleci.com/gh/jhuapl-boss/substrate/tree/master)

## Installation and Configuration

- Clone the repository.
```
git clone https://github.com/jhuapl-boss/substrate.git
```
- Install all dependencies.
```
npm install
```

## Testing
- Install eslint and its react plugin:
```
npm i --global eslint eslint-plugin-react@latest --save-dev
```
- Run the tests:
```
./run-lint
```

## Usage
- Run the server:
```
./run-server
```
- Now open your browser and navigate to `http://localhost:8003/`.

 Navigate by clicking and dragging. Use <kbd>1</kbd>, <kbd>3</kbd>, and <kbd>7</kbd> to snap to cardinal axis views. Press <kbd>D</kbd> while dragging to pan instead of tilt. Scroll to zoom. (These keyboard controls are defined by the end-develoer )

### Using `substrate`

This system exposes inheritable `Layer`s that can be extended to provide a visualization engine for independent 3D or 2D objects in order to combine them efficiently in the same scene.

More documentation forthcoming... In the meantime, see the inline documentation, or get in touch with @j6k4m8.

## License
If not otherwise marked, all code in this repository falls under the license granted in LICENSE.md.