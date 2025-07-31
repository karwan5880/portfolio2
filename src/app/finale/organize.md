# Finale Folder Organization Plan

## Current Issues

- Test files scattered in root DroneShow folder
- Multiple backup folders with overlapping content
- Test routes in separate folders that could be consolidated
- Backup files mixed with active code

## Proposed Structure

```
src/app/finale/
├── page.js                    # Main finale route
├── page.module.css           # Finale styles
├── DroneShow/                # Core drone show components
│   ├── DroneShow.js          # Main component
│   ├── Scene.js              # 3D scene
│   ├── DroneSystem.js        # Drone behavior
│   ├── TextRenderer.js       # Text rendering
│   ├── CollisionAnalyzer.js  # Collision detection
│   ├── formationSystem.js    # Formation management
│   ├── lightShader.js        # Current light shader
│   ├── positionShader.js     # Current position shader
│   ├── formations/           # Formation definitions
│   ├── src/                  # Additional source files
│   └── README.md             # Documentation
├── tests/                    # All test files consolidated
│   ├── collision-test/       # Moved from root
│   ├── formations-test/      # Moved from root
│   ├── html-tests/          # HTML test files
│   └── js-tests/            # JavaScript test files
├── backups/                  # All backup files
│   ├── shaders/             # Shader backups
│   ├── components/          # Component backups
│   └── archived/            # Old bak folder content
└── docs/                    # Documentation
    ├── REFACTORING_SUMMARY.md
    └── TEXT_ENHANCEMENT_SUMMARY.md
```

## Manual Steps to Organize

### 1. Create new folder structure

```bash
mkdir src/app/finale/tests
mkdir src/app/finale/backups
mkdir src/app/finale/backups/shaders
mkdir src/app/finale/backups/components
mkdir src/app/finale/docs
```

### 2. Move test routes

```bash
move src/app/finale/collision-test src/app/finale/tests/
move src/app/finale/formations-test src/app/finale/tests/
```

### 3. Move documentation

```bash
move src/app/finale/DroneShow/REFACTORING_SUMMARY.md src/app/finale/docs/
move src/app/finale/DroneShow/TEXT_ENHANCEMENT_SUMMARY.md src/app/finale/docs/
```

### 4. Move backup shader files

```bash
move src/app/finale/DroneShow/lightShader_backup.js src/app/finale/backups/shaders/
move src/app/finale/DroneShow/lightShader_best_version_backup.js src/app/finale/backups/shaders/
move src/app/finale/DroneShow/positionShader_checkpoint.js src/app/finale/backups/shaders/
move src/app/finale/DroneShow/positionShader_enhanced_checkpoint.js src/app/finale/backups/shaders/
move src/app/finale/DroneShow/positionShader_random_checkpoint.js src/app/finale/backups/shaders/
```

### 5. Move test files

```bash
move src/app/finale/DroneShow/coordinate-mapping-test.js src/app/finale/tests/js-tests/
move src/app/finale/DroneShow/test-bug-fixes.js src/app/finale/tests/js-tests/
move src/app/finale/DroneShow/test-implementation.js src/app/finale/tests/js-tests/
```

### 6. Archive old bak folder

```bash
move src/app/finale/DroneShow/bak src/app/finale/backups/archived
```

### 7. Clean up empty folders and update imports

## Benefits

- Clear separation of active code vs tests vs backups
- Easier navigation and maintenance
- Better organization for future development
- Cleaner git history and diffs
