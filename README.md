# NewTek TriCaster Legacy for Bitfocus Companion

A Bitfocus Companion module for older NewTek TriCaster systems that use the legacy TCP control and `NTK_states` interface.

> **Beta**
>
> This module is under active development and should be considered pre-release software. Initial development and testing have been performed with a NewTek TriCaster XD860.

## Purpose

Newer NewTek/Vizrt TriCaster systems use a different control interface from many older TriCaster models.

The current NewTek TriCaster module for Bitfocus Companion targets the newer interface and may not provide the state feedback required by older systems.

This project is intended to provide Companion support for legacy TriCaster systems using the older TCP interface.

The initial focus is reliable **state feedback**, allowing Companion buttons to reflect what the TriCaster is actually doing instead of simply assuming that a previously sent command succeeded.

## Current Status

Version `1.0.0-beta.1` is the first public beta.

Current functionality includes:

- TCP connection to the legacy TriCaster interface on port `5951`
- Registration for `NTK_states`
- Initial shortcut-state reception
- Incremental state-change reception
- Generic parsing of `<shortcut_state>` messages
- Generic `Shortcut State Equals` Companion feedback
- Automatic reconnection after a lost connection
- Re-registration for state updates after reconnecting
- Optional verbose logging for development and troubleshooting

Additional functionality is planned.

## Tested Configuration

Initial development has been performed with:

- **TriCaster:** NewTek TriCaster XD860
- **Product identifier:** `XD860`
- **TriCaster build:** `2-6-170817`
- **Companion:** Bitfocus Companion 5.0.3

Other legacy TriCaster models have not yet been verified.

Different models may expose different shortcut states and capabilities.

## Installation

### Prebuilt Beta Package

For normal installation, Node.js, npm, Yarn, and other development tools are **not required**.

Download the `.tgz` file attached to the desired GitHub Release.

For example:

`newtek-tricaster-legacy-1.0.0-beta.1.tgz`

Install the module package through Bitfocus Companion's module/developer-module installation interface.

After installation:

1. Add a **NewTek TriCaster Legacy** connection.
2. Enter the IP address of the TriCaster.
3. Save the configuration.
4. Verify that the connection reports as connected.

The Companion computer must have network access to the TriCaster.

## How It Works

The module connects to the TriCaster using TCP port `5951`.

After connecting, it registers for the legacy state interface by sending:

`<register name="NTK_states"/>`

The TriCaster then supplies state information using messages containing entries such as:

```xml
<shortcut_state
    name="main_output2_select_named_input"
    value="program"
    type="unknown"
    sender=""
/>