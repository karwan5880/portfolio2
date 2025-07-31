# DroneShow Organization

## Current Structure

### Core Components (Keep in root)

- `DroneShow.js` - Main orchestrator component
- `Scene.js` - 3D scene setup
- `DroneSystem.js` - Drone behavior and formations
- `TextRenderer.js` - Text formation rendering
- `CollisionAnalyzer.js` - Collision detection system
- `formationSystem.js` - Formation management
- `lightShader.js` - Current light shader
- `positionShader.js` - Current position shader

### Documentation

- `REFACTORING_SUMMARY.md` - Refactoring notes
- `TEXT_ENHANCEMENT_SUMMARY.md` - Text enhancement notes

### Organized Folders

#### `/tests/` - Test Files

- `/tests/js-tests/` - JavaScript test files
  - `coordinate-mapping-test.js`
  - `test-bug-fixes.js`
  - `test-implementation.js`

#### `/backups/` - Backup Files

- `lightShader_backup.js`
- `lightShader_best_version_backup.js`
- `positionShader_checkpoint.js`
- `positionShader_enhanced_checkpoint.js`
- `positionShader_random_checkpoint.js`

#### Existing Folders

- `/bak/` - Original backup folder (can be cleaned up)
- `/formations/` - Formation definitions
- `/src/` - Source files

## Cleanup Recommendations

1. Move test files from root to `/tests/js-tests/`
2. Move backup shader files to `/backups/`
3. Review and clean up `/bak/` folder
4. Consider moving HTML test files to `/tests/html-tests/` if they exist
