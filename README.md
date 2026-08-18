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

Version `1.0.0-beta.1.2` is the current development beta.

Version `1.0.0-beta.1` established the initial TCP 5951 connection, `NTK_states` reception, parsing, and single-state feedback functionality.

Version `1.0.0-beta.1.1` expands the feedback system and adds selected TriCaster states as Companion variables.

Version `1.0.0-beta.1.2` adds a generic shortcut command action for sending legacy TriCaster shortcut commands directly over TCP port 5951.

The functionality added in versions `1.0.0-beta.1.1` and `1.0.0-beta.1.2` is awaiting live TriCaster testing.

Current functionality includes:

- TCP connection to the legacy TriCaster interface on port `5951`
- Registration for `NTK_states`
- Initial shortcut-state reception
- Incremental state-change reception
- Generic parsing of `<shortcut_state>` messages
- Generic `Shortcut State Equals` Companion feedback
- Multiple-condition shortcut-state feedback with up to four conditions
- AND or OR logic for multiple-condition feedback
- Equal or Not Equal comparison for each multiple-feedback condition
- Companion variables for selected useful `NTK_states`
- Automatic reconnection after a lost connection
- Re-registration for state updates after reconnecting
- Optional verbose logging for development and troubleshooting
- Generic `Send Shortcut Command` action using a temporary TCP port 5951 connection

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

`newtek-tricaster-legacy-1.0.0-beta.1.1.tgz`

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
```

The module stores received shortcut states by their `name` and updates them whenever the TriCaster reports a change.

## Actions

### Send Shortcut Command

Version `1.0.0-beta.1.2` adds a generic action for sending legacy TriCaster shortcut commands directly over TCP port `5951`.

The action provides two fields:

- **Shortcut Name** - The TriCaster shortcut command name.
- **Value** - The value to send with the shortcut command.

For example:

Shortcut Name:

`main_a_row_named_input`

Value:

`input1`

The module sends:

```xml
<shortcut name='main_a_row_named_input' value='input1' />
```

Some shortcut commands do not require a value. For those commands, leave the **Value** field blank.

For example:

Shortcut Name:

`main_auto`

Value:

*(blank)*

The module sends:

```xml
<shortcut name='main_auto' />
```

Each action execution creates a temporary TCP connection to port `5951`, sends the shortcut command, and closes that command connection. This is separate from the persistent TCP connection used by the module to receive `NTK_states`.

The generic action intentionally does not restrict the available shortcut names or values. This allows additional legacy TriCaster commands to be tested without requiring a new module build.

Command names, accepted values, and available functions may vary between legacy TriCaster models and software versions. The generic command action should therefore be tested with the specific TriCaster before being relied upon for production control.

## Feedbacks

### Shortcut State Equals

The original single-state feedback allows a Companion feedback to monitor any shortcut state reported by the TriCaster.

Configure:

- **State Name** - The exact `NTK_states` shortcut-state name.
- **Expected Value** - The value that should activate the feedback.

The feedback becomes active when the current value of the specified state exactly matches the expected value.

### Shortcut States - Multiple Conditions

Version `1.0.0-beta.1.1` adds a separate multiple-condition feedback while preserving the original single-state feedback.

Up to four shortcut-state conditions may be configured.

Each condition contains:

- **State Name** - The exact `NTK_states` shortcut-state name.
- **Comparison** - Equal or Not Equal.
- **Expected Value** - The value used for the comparison.

The conditions can use either:

- **AND** - All configured conditions must be true.
- **OR** - At least one configured condition must be true.

Conditions with a blank State Name are ignored.

## Variables

Version `1.0.0-beta.1.1` adds Companion variables for selected useful TriCaster shortcut states.

The Companion variable ID intentionally uses the actual `NTK_states` name reported by the TriCaster. A human-readable description is provided in Companion to explain the purpose of each variable.

Current variables are:

| Variable ID | Description |
| --- | --- |
| `main_a_row_named_input` | Main program row current value |
| `main_b_row_named_input` | Main preview row current value |
| `main_output2_select_named_input` | Output 2 current source |
| `main_dsk1_select_named_input` | Main DSK 1 current source |
| `main_dsk2_select_named_input` | Main DSK 2 current source |
| `main_fx_select_named_input` | Main FX current source |
| `v1_a_row_named_input` | M/E1 row A current value |
| `v1_b_row_named_input` | M/E1 row B current value |
| `v2_a_row_named_input` | M/E2 row A current value |
| `v2_b_row_named_input` | M/E2 row B current value |
| `v3_a_row_named_input` | M/E3 row A current value |
| `v3_b_row_named_input` | M/E3 row B current value |
| `v4_a_row_named_input` | M/E4 row A current value |
| `v4_b_row_named_input` | M/E4 row B current value |
| `v5_a_row_named_input` | M/E5 row A current value |
| `v5_b_row_named_input` | M/E5 row B current value |
| `v6_a_row_named_input` | M/E6 row A current value |
| `v6_b_row_named_input` | M/E6 row B current value |
| `v7_a_row_named_input` | M/E7 row A current value |
| `v7_b_row_named_input` | M/E7 row B current value |
| `v8_a_row_named_input` | M/E8 row A current value |
| `v8_b_row_named_input` | M/E8 row B current value |
| `program_tally` | Sources currently contributing to Program |
| `preview_tally` | Sources currently contributing to Preview |

These variables are intended to make commonly useful TriCaster state information directly available in Companion without requiring verbose logging or diagnostic feedback buttons.

The exact states and values exposed by other legacy TriCaster models may differ.

## Development Status

The multiple-condition feedback and Companion variables introduced in `1.0.0-beta.1.1` have been implemented but have not yet completed live TriCaster testing.

The generic `Send Shortcut Command` action introduced in `1.0.0-beta.1.2` has been implemented but has not yet completed live TriCaster testing.

The initial beta 1.2 command implementation intentionally provides a generic shortcut name and value interface rather than predefined command dropdowns. This allows the legacy TCP port 5951 command mechanism and additional shortcut commands to be tested before more specialized actions are added.

Future development may include additional state discovery, predefined command dropdowns, and multi-step TriCaster actions based on commands verified on legacy TriCaster systems.