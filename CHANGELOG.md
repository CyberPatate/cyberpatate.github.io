# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-beta14] - 2026-11-12

### Features

- Resizable 2D floating popup window accessible from `Plugins > AlphaFloor EFB > Show EFB Window` or the `AlphaFloorEFB/toggle_window` command
- Add support for Aerobask Diamond DA42, Airfoillabs Cessna 172 Digital, and Laminar Airbus A330-300
- Compute single engine out go-around gradient on Landing Performance page
- Include planned runways into ATC filed route text on SimBrief page

### Fixes

- Correct runway length and landing calculation parameters
- Improve radar map Fit Route icon clarity

## [1.0.0-beta13] - 2026-11-06

### Features

- New Weather app with enroute radar map and vertical atmospheric profile

### Fixes

- Support pinch-to-zoom on tablets and prevent unintended page zoom in Charts, Moving Map, PDF viewer, and Weather map
- Cycle door mode through Auto state on Ground Ops page

## [1.0.0-beta12] - 2026-11-02

### Features

- Real world CG graphs in the Weight & Balance app
- Allow pasting from the clipboard in any textfield in the cockpit EFB
- Allow disabling the Virtual Keyboard entirely in the Settings app

### Fixes

- Fix Windows key input handling
- Pinned charts in the Charts app are no longer restored across flights

## [1.0.0-beta11] - 2026-10-28

### Features

- New Browser app

## [1.0.0-beta10] - 2026-10-27

### Features

- Directly display available runways and intersections on takeoff and landing performance pages without nested submenus
- Add in-cockpit minimize button to quickly access ToLiss ISCS and restore via the AviTab tab
- Register AlphaFloorEFB/toggle_overlay command to toggle cockpit EFB overlay
- Add QR code in Settings for quick remote tablet access

### Fixes

 - Fix decimal value input in takeoff perf app
 - Clicking on the OFP widget tries to synchronize the OFP again
 - Should finally fix all crashes after X-Plane exit on Windows

## [1.0.0-beta9] - 2026-10-24

- Fix crash on X-Plane exit on Windows
- Fix licenses being removed on SkunkCrafts update
- Cleanup log messages in Log.txt in release builds

## [1.0.0-beta8] - 2026-10-21

- Add support for imperial units
- Add support for a "professional" theme

## [1.0.0-beta7] - 2026-10-20

- Enable seatmap view and pax distribution support in the Weight & Balance app
- Don't leak clipboard data over the network

## [1.0.0-beta6] - 2026-10-20

- Fix Navigraph activation on Windows

## [1.0.0-beta5] - 2026-10-20

- Fix Navigraph activation on Windows
- Fix performance calculation apps not saving their state

## [1.0.0-beta4] - 2026-10-20

- Fix external browser launch for Navigraph activation on Windows and Linux

## [1.0.0-beta3] - 2026-10-19

- Fix Windows support
- Fine-tune performance calculation apps

## [1.0.0-beta2] - 2026-10-19

### Added

- UI tweaks
- Add paste button to the Activation Key field in the cockpit

## [1.0.0-beta1] - 2026-10-16

First beta release for the closed beta testing campaign.

## [0.3.0] - 2026-10-16

Synchronize EFBs across all devices.
Update documentation.

## [0.2.2] - 2026-10-14

Fix user guide PDF generation.

## [0.2.1] - 2026-10-14

Fix Skunkcrafts updater release package generation.

## [0.2.0] - 2026-10-14

Add documentation.

## [0.1.0] - 2026-10-14

Initial release.
