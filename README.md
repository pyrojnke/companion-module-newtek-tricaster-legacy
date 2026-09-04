# NewTek TriCaster Legacy for Bitfocus Companion

A Bitfocus Companion module for older NewTek TriCaster systems that use the legacy TCP control and `NTK_states` interface.

> **Stable Release**
>
> Version `1.1.0` is the current stable release.

Version `1.1.0` is a maintenance and compatibility release that modernizes the module SDK, runtime, and development toolchain while preserving the TriCaster control and feedback behavior of version `1.0.0`. No new TriCaster features are introduced in this release.

The 1.1.0 migration includes:

- Bitfocus Companion module API 2 compatibility
- `@companion-module/base` 2.1.3
- `@companion-module/tools` 3.1.0
- Node.js 26 module runtime
- Yarn 4.18.0 development tooling
- ESLint 10.2.0
- Prettier 3.8.1
- Updated API 2 variable-definition format
- Updated module entrypoint/export structure for the current Companion module runtime

Version `1.1.0` completed hardware regression testing on the tested NewTek TriCaster XD860 running build `2-6-170817`. The existing version `1.0.0` feature set passed regression testing after the SDK/runtime migration.

## Purpose

Newer NewTek/Vizrt TriCaster systems use a different control interface from many older TriCaster models.

The current NewTek TriCaster module for Bitfocus Companion targets the newer interface and may not provide the control and state feedback required by older systems.

This project is intended to provide Companion support for legacy TriCaster systems using the older TCP interface.

A primary goal of the module is reliable **state feedback**, allowing Companion buttons to reflect what the TriCaster is actually doing instead of simply assuming that a previously sent command succeeded.

## Current Status

Version `1.0.0` is the current stable release.

Version `1.0.0-beta.1` established the initial TCP 5951 connection, `NTK_states` reception, parsing, and single-state feedback functionality.

Version `1.0.0-beta.1.1` expanded the feedback system and added selected TriCaster states as Companion variables.

Version `1.0.0-beta.1.2` added a generic shortcut command action for sending legacy TriCaster shortcut commands directly over TCP port `5951`.

Version `1.0.0-beta.1.3` adds dedicated user-friendly actions and feedbacks for commonly used TriCaster functions, expands the available Companion variables, and retains the generic shortcut action and feedbacks as Advanced tools.

Version `1.0.0-beta.1.4` improves dedicated feedback state updating, normalizes source-state comparisons, expands source choices and framebuffer support, adds Program DSK source control and feedback, adds M/E DSK on-air feedback, and adds LiveMatte toggle control and status feedback.

Version `1.0.0-beta.1.5` fixes numbered-buffer source feedback for Program and M/E DSKs and adds a dedicated action for running TriCaster macros by name.

Version `1.0.0` promotes the hardware-validated Beta 1.5 feature set to the first stable release with no functional changes.

Beta 1.5 completed live hardware validation on the tested TriCaster XD860. The validated Beta 1.5 codebase is the basis of stable version `1.0.0`.

Current functionality includes:

- TCP connection to the legacy TriCaster interface on port `5951`
- Registration for `NTK_states`
- Initial shortcut-state reception
- Incremental state-change reception
- Generic parsing of `<shortcut_state>` messages
- Dedicated actions for commonly used verified TriCaster controls
- Dedicated feedbacks for commonly used TriCaster states
- Companion variables for selected useful `NTK_states`
- Advanced single-state feedback
- Advanced multiple-condition feedback with AND/OR and Equal/Not Equal comparisons
- Advanced shortcut command action for direct legacy command access
- Automatic reconnection after a lost connection
- Re-registration for state updates after reconnecting
- Optional verbose logging for development and troubleshooting

## Tested Configuration

Initial development and state capture have been performed with:

- **TriCaster:** NewTek TriCaster XD860
- **Product identifier:** `XD860`
- **TriCaster build:** `2-6-170817`
- **Companion:** Bitfocus Companion 5.0.3

Other legacy TriCaster models have not yet been verified.

Different models and software versions may expose different shortcut states, source names, commands, and capabilities.

## Installation

### Prebuilt Package

For normal installation, Node.js, npm, Yarn, and other development tools are **not required**.

Download the `.tgz` file attached to the desired GitHub Release.

For version 1.0.0:

`newtek-tricaster-legacy-1.0.0.tgz`

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

Control actions send legacy shortcut commands to TCP port `5951`.

Each action execution creates a temporary TCP command connection, sends the requested shortcut command, and closes the command connection. This is separate from the persistent TCP connection used to receive `NTK_states`.

## Actions

The module provides dedicated actions for commonly used TriCaster controls.

### Program/Preview: Set Source

Select a source for either the Main Program or Preview row.

Available source choices currently include:

- Input 1-8
- NET 1
- NET 2
- DDR 1
- DDR 2
- STILLS
- FRAME BUFFER
- TITLES
- BLACK

### Program: AUTO

Performs the Main AUTO transition.

### Program: CUT

Performs the Main CUT transition.

### Program DSK: Set Source

Select a source for Main DSK 1 or DSK 2.

### Program DSK: AUTO

Performs an AUTO transition for Main DSK 1 or DSK 2.

### Program DSK: TAKE

Performs a TAKE for Main DSK 1 or DSK 2.

### M/E Row: Set Source

Select:

- M/E 1-8
- Row A or B
- Source

This provides source selection for the A and B rows of the selected M/E.

M/E C and D row support is not currently exposed as a dedicated action.

### M/E DSK: Set Source

Select:

- M/E 1-8
- Source

This sets the source for the selected M/E DSK.

### M/E: AUTO

Performs an AUTO transition on the selected M/E.

### M/E: TAKE

Performs a TAKE transition on the selected M/E.

### Main FX: Set Source

Selects the source used by Main FX.

### Output 2: Set Source

Sets the source routed to TriCaster Output 2.

The Output 2 source list includes direct sources as well as M/E 1-8 where supported by the TriCaster.

### Macro: Run by Name

Runs a TriCaster macro by its exact macro name.

Enter the macro name in the **Macro Name** field.

For example:

`Combined Screens`

The module sends the legacy shortcut command:

```xml
<shortcut name='play_macro_byname' value='Combined Screens' />
```

Macro names containing spaces are supported.

### Advanced: Send Shortcut Command

This action provides direct access to the legacy TriCaster shortcut command interface.

It provides two fields:

- **Shortcut Name** - The TriCaster shortcut command name.
- **Value** - The value to send with the shortcut command.

For example:

Shortcut Name:

`main_a_row_named_input`

Value:

`Input1`

The module sends:

```xml
<shortcut name='main_a_row_named_input' value='Input1' />
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

The Advanced action intentionally does not restrict the available shortcut names or values. This allows additional legacy TriCaster commands to be investigated without requiring a new module build.

Command names, accepted values, and available functions may vary between legacy TriCaster models and software versions.

Use the dedicated actions when an appropriate dedicated action exists. The Advanced action is intended primarily for development, troubleshooting, command discovery, and functions that do not yet have a dedicated action.

## Feedbacks

The module provides dedicated boolean feedbacks for commonly used TriCaster states.

Companion controls the styling applied when these feedbacks are active.

### Program/Preview: Source Selected

Select:

- Program or Preview
- Source

The feedback becomes active when the selected source is currently selected on the chosen Main row.

### Program DSK: On Air

Select Main DSK 1 or DSK 2.

The feedback becomes active whenever the selected DSK is contributing to Program.

A DSK is considered contributing whenever its reported transition/on-air value is greater than zero. This means the feedback becomes active while the DSK is transitioning on and remains active while it is transitioning off until its contribution reaches zero.

### Program DSK: Source Selected

Select Main DSK 1 or DSK 2 and the source to monitor.

The feedback becomes active when the selected source is currently selected on that Main DSK.

For numbered framebuffer sources, the module uses the TriCaster's numeric DSK source state because legacy TriCaster systems may report the persistent named source only as `framebuffer`.

### M/E Row: Source Selected

Select:

- M/E 1-8
- Row A or B
- Source

The feedback becomes active when the selected source is currently selected on that M/E row.

### M/E DSK: Source Selected

Select:

- M/E 1-8
- Source

The feedback becomes active when the selected source is currently selected on that M/E DSK.

### Output 2: Source Selected

Select an Output 2 source.

The feedback becomes active when the TriCaster reports that source as the current Output 2 selection.

The available choices correspond to the sources available through the dedicated Output 2 action.

### DDR: Playing

Select DDR 1 or DDR 2.

The feedback becomes active when the selected DDR reports that it is playing.

### Tally: Source On Program/Preview

Select:

- Program or Preview tally
- Source

The feedback becomes active when the selected source appears in the corresponding TriCaster tally state.

The legacy TriCaster may report multiple simultaneously contributing sources in a pipe-delimited tally value, for example:

`Input1|Net|BFR5|V5`

The module parses these as individual sources and performs an exact source match.
### Advanced: Shortcut State Equals

This feedback monitors any individual shortcut state reported by the TriCaster.

Configure:

- **State Name** - The exact `NTK_states` shortcut-state name.
- **Expected Value** - The value that should activate the feedback.

The feedback becomes active when the current value of the specified state exactly matches the expected value.

This feedback is retained as an Advanced tool for states that do not have dedicated feedbacks.

### Advanced: Shortcut States - Multiple Conditions

This feedback monitors up to four TriCaster shortcut-state conditions simultaneously.

Each condition contains:

- **State Name** - The exact `NTK_states` shortcut-state name.
- **Comparison** - Equal or Not Equal
- **Expected Value** - The value used for the comparison

The conditions can use either:

- **AND** - All configured conditions must be true
- **OR** - At least one configured condition must be true

Conditions with a blank State Name are ignored.

This feedback is retained as an Advanced tool for custom or complex state logic.

## Variables

Selected useful `NTK_states` are exposed directly as Companion variables.

The Companion variable ID intentionally uses the actual `NTK_states` name reported by the TriCaster. A human-readable description is provided in Companion to explain the purpose of each variable.

Current variables include:

| Variable ID | Description |
| --- | --- |
| `main_a_row_named_input` | Main program row current value |
| `main_b_row_named_input` | Main preview row current value |
| `main_output2_select_named_input` | Output 2 current source |
| `main_dsk1_select_named_input` | Main DSK 1 current source |
| `main_dsk2_select_named_input` | Main DSK 2 current source |
| `main_fx_select_named_input` | Main FX current source |
| `main_dsk1_value` | Main DSK 1 transition/on-air value |
| `main_dsk2_value` | Main DSK 2 transition/on-air value |
| `main_value` | Main transition position |
| `main_auto` | Main AUTO transition state |
| `v1_a_row_named_input` | M/E1 row A current value |
| `v1_b_row_named_input` | M/E1 row B current value |
| `v1_dsk1_select_named_input` | M/E1 DSK current source |
| `v2_a_row_named_input` | M/E2 row A current value |
| `v2_b_row_named_input` | M/E2 row B current value |
| `v2_dsk1_select_named_input` | M/E2 DSK current source |
| `v3_a_row_named_input` | M/E3 row A current value |
| `v3_b_row_named_input` | M/E3 row B current value |
| `v3_dsk1_select_named_input` | M/E3 DSK current source |
| `v4_a_row_named_input` | M/E4 row A current value |
| `v4_b_row_named_input` | M/E4 row B current value |
| `v4_dsk1_select_named_input` | M/E4 DSK current source |
| `v5_a_row_named_input` | M/E5 row A current value |
| `v5_b_row_named_input` | M/E5 row B current value |
| `v5_dsk1_select_named_input` | M/E5 DSK current source |
| `v6_a_row_named_input` | M/E6 row A current value |
| `v6_b_row_named_input` | M/E6 row B current value |
| `v6_dsk1_select_named_input` | M/E6 DSK current source |
| `v7_a_row_named_input` | M/E7 row A current value |
| `v7_b_row_named_input` | M/E7 row B current value |
| `v7_dsk1_select_named_input` | M/E7 DSK current source |
| `v8_a_row_named_input` | M/E8 row A current value |
| `v8_b_row_named_input` | M/E8 row B current value |
| `v8_dsk1_select_named_input` | M/E8 DSK current source |
| `ddr_play` | DDR 1 Play state |
| `ddr_stop` | DDR 1 Stop state |
| `ddr2_play` | DDR 2 Play state |
| `ddr2_stop` | DDR 2 Stop state |
| `program_tally` | Sources currently contributing to Program |
| `preview_tally` | Sources currently contributing to Preview |

These variables make commonly useful TriCaster state information directly available in Companion without requiring verbose logging or diagnostic feedback buttons.

The exact states and values exposed by other legacy TriCaster models may differ.

## Source and Output Choices

The module separates normal source choices from Output 2 routing choices.

The standard source list is used for controls such as Program/Preview and M/E source selection.

Output 2 has a separate routing list because it can also route M/E outputs.

This separation allows the module to expand different destination-specific source lists later without unnecessarily exposing invalid choices in unrelated actions.

## Unsupported or Missing States

Different legacy TriCaster models may provide different shortcut states.

A state or command available on an XD860 may not exist on a smaller, older, or differently configured TriCaster.

The module should not assume that every legacy TriCaster has the same number of inputs, M/Es, outputs, media players, or other resources.

If a feedback references a state that the connected TriCaster does not provide, the feedback will remain inactive.

Variables corresponding to states not supplied by the connected TriCaster may remain unset.

## Connection Recovery

If the persistent state connection to the TriCaster is lost, the module attempts to reconnect automatically.

After reconnecting, the module registers for `NTK_states` again so that state feedback and variables can resume updating.

## Version 1.0.0 Validation Status

Version `1.0.0` is based on the Beta 1.5 codebase that completed live hardware validation on the tested TriCaster XD860.

The validated test scope included:

- Program and Preview source control and feedback
- Main DSK source control, numbered-buffer feedback, transitions, and on-air feedback
- M/E row source control and feedback
- M/E DSK source control, numbered-buffer feedback, transitions, and on-air feedback
- Output 2 routing and feedback, including Program Clean and numbered buffers
- LiveMatte control and feedback
- Program/Preview tally feedback
- Macro execution by name, including macro names containing spaces
- Advanced shortcut-state feedback
- Existing transition and Main FX action regression checks

Other legacy TriCaster models and software versions may expose different commands, states, or capabilities and have not yet been fully validated.

## Known Limitations and Future Development

Areas that may be investigated in future versions include:

- Dedicated DDR/media-player actions based on commands already verified on legacy hardware
- Audio control
- Graphics and media selection
- Additional source-choice discovery
- M/E C and D row behavior
- Additional M/E and FX behavior
- Program transition delegation
- Additional state discovery
- Recording and streaming states where supported
- Additional legacy TriCaster model compatibility
- Reconnection/error-handling improvements if testing shows they are needed
- Additional dedicated actions and feedbacks based on verified legacy commands
- Generic framebuffer assignment using verified dictionary-style TriCaster commands

Features should be added based on behavior verified on legacy TriCaster hardware rather than assuming that commands or states used by newer TriCaster systems behave identically.

## Reporting Compatibility

Testing on additional legacy TriCaster models is useful.

When reporting compatibility or a problem, please include:

- TriCaster model
- TriCaster software/build version
- Companion version
- Module version
- Whether the module connects successfully
- Action or feedback being tested
- Relevant verbose log output
- Description of the state or function being tested

Do not include passwords, API credentials, or other sensitive information in logs or public issue reports.

## Production Use

Version `1.0.0` has completed hardware validation on the tested TriCaster XD860.

Because legacy TriCaster models and software builds may expose different commands, states, and capabilities, verify required functions on your particular TriCaster and Companion installation before relying on the module for critical production control or status indication.