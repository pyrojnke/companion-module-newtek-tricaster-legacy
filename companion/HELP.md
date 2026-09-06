# NewTek TriCaster Legacy

A Bitfocus Companion module for older NewTek TriCaster systems that use the legacy TCP control and state interface.

> **Version 1.1.0**
>
> Version `1.1.0` is the current stable release. It updates the module to the current Bitfocus Companion module API, runtime, and development toolchain while preserving the TriCaster control and feedback behavior of version `1.0.0`.
>
> Version `1.1.0` has been hardware regression-tested with a NewTek TriCaster XD860 running build `2-6-170817`. No new TriCaster control or feedback features are introduced in this release. Other legacy TriCaster models may expose different states, commands, source names, or fewer features.

## Why This Module Exists

Older NewTek TriCaster systems use a different control and feedback interface than newer TriCaster models.

The current NewTek TriCaster Companion module is designed for the newer command/API system and may not provide the required control and feedback from older systems such as the TriCaster XD860.

This module provides Companion integration for those older TriCaster systems using the legacy TCP interface.

## Connection

Enter the IP address of the TriCaster in the module configuration.

The module connects to:

- TCP port: `5951`
- State registration: `NTK_states`

After connecting, the module sends:

`<register name="NTK_states"/>`

The TriCaster then reports its available shortcut states and subsequent state changes.

The module maintains this connection for state feedback. Control actions use separate temporary TCP connections to send commands.

## Configuration

### TriCaster IP Address

Enter the IPv4 address of the TriCaster.

Example:

`192.168.1.100`

The Companion computer must be able to communicate with the TriCaster over the network.

### Enable Verbose Logging

Enables logging of state information received from the TriCaster.

This is primarily intended for:

- Troubleshooting
- Discovering state names and values
- Development
- Testing additional TriCaster models

Verbose logging may generate a large amount of information and normally should be disabled after testing.

The commonly used states exposed as Companion variables can be viewed without enabling verbose logging.

## Actions

The module provides dedicated actions for commonly used TriCaster controls. The Advanced shortcut action remains available for development, troubleshooting, and commands that do not yet have dedicated actions.

### Program/Preview: Set Source

Sets the source on the Main Program or Preview row.

Choose:

**Destination**

- Program
- Preview

**Source**

Available choices currently include:

- Input 1-8
- NET 1
- NET 2
- DDR 1
- DDR 2
- STILLS
- FRAME BUFFER
- TITLES
- BLACK

The available source names are based on values verified during development with the XD860.

### Program: AUTO

Performs the Main AUTO transition.

This sends the legacy `main_auto` shortcut command.

### Program: CUT

Performs the Main CUT transition.

### Program DSK: Set Source

Sets the source for Main DSK 1 or Main DSK 2.

Choose:

**DSK**

- DSK 1
- DSK 2

**Source**

Choose the desired source from the available source list.

### Program DSK: AUTO

Performs an AUTO transition on the selected Main DSK.

Choose:

- DSK 1
- DSK 2

### Program DSK: TAKE

Performs a TAKE on the selected Main DSK.

Choose:

- DSK 1
- DSK 2

### M/E Row: Set Source

Sets the source on an M/E A or B row.

Choose:

**M/E**

- M/E 1-8

**Row**

- A
- B

**Source**

Choose the desired source.

M/E C and D row behavior has not yet been sufficiently verified and is therefore not exposed through this dedicated action.

### M/E DSK: Set Source

Sets the source for the selected M/E DSK.

Choose:

**M/E**

- M/E 1-8

**Source**

Choose the desired source.

### M/E: AUTO

Performs an AUTO transition on the selected M/E.

Choose M/E 1-8.

### M/E: TAKE

Performs a TAKE transition on the selected M/E.

Choose M/E 1-8.

### Main FX: Set Source

Sets the source used by Main FX.

Choose the desired source from the available source list.

### Output 2: Set Source

Sets the source routed to TriCaster Output 2.

Output 2 uses a separate choice list from normal source-selection actions because Output 2 can also route M/E outputs.

Available choices include direct sources and M/E 1-8 where supported by the TriCaster.

### Macro: Run by Name

Runs a TriCaster macro by its exact macro name.

Enter the desired macro name in the **Macro Name** field.

For example:

`Combined Screens`

The module sends:

```xml
<shortcut name='play_macro_byname' value='Combined Screens' />
```

Macro names containing spaces are supported.

### Advanced: Send Shortcut Command

Provides direct access to the legacy TriCaster shortcut command interface.

Use the dedicated actions above when an appropriate dedicated action exists.

The Advanced action provides:

**Shortcut Name**

Enter the TriCaster shortcut command name.

Example:

`main_a_row_named_input`

**Value**

Enter the value to send with the shortcut command.

Example:

`Input1`

This example sends:

```xml
<shortcut name='main_a_row_named_input' value='Input1' />
```

Some shortcut commands do not require a value. Leave the **Value** field blank for those commands.

For example:

Shortcut Name:

`main_auto`

Value:

*(blank)*

This sends:

```xml
<shortcut name='main_auto' />
```

The Advanced action intentionally allows arbitrary shortcut names and values so that additional legacy TriCaster commands can be investigated without requiring a new module build.

Available shortcut commands and accepted values may differ between TriCaster models and software versions.

### Advanced: Send Dictionary Shortcut

Provides experimental access to legacy TriCaster shortcut commands that require multiple Key/Value parameters.

This action is intended primarily for:

- Development
- Hardware testing
- Command discovery
- Future functions that require more than a single shortcut value

Configure:

**Shortcut Name**

Enter the exact TriCaster shortcut name.

**Number of Keys**

Select how many Key/Value fields should be available.

The action supports 1 through 13 Key/Value pairs.

Only keys within the selected count are considered. If a higher-numbered field previously contained a value and the Number of Keys is later reduced, the hidden field is ignored.

For each selected key, enter:

- **Key N Name**
- **Key N Value**

A Key/Value pair is sent only when both its Name and Value are nonblank. Blank or incomplete pairs are ignored.

Dictionary key names, value meanings, and expected value types depend on the specific TriCaster shortcut.

For example, the legacy framebuffer-change shortcut definition uses these dictionary keys:

- `ShortCutName`
- `FrmBfrName`
- `UpdateUI`

A development test configuration might therefore use:

Shortcut Name:

`v1_frmbfr_change`

Key 1 Name:

`ShortCutName`

Key 1 Value:

`v1_a_row_named_input`

Key 2 Name:

`FrmBfrName`

Key 2 Value:

`BFR1`

Key 3 Name:

`UpdateUI`

Key 3 Value:

`true`

The current implementation serializes these Key/Value pairs as additional XML attributes on the legacy `<shortcut>` command.

**This dictionary transport has not yet been hardware-validated on the tested XD860 and should be treated as experimental until that validation is completed.**

Use known TriCaster shortcut definitions when configuring this action rather than guessing command names, dictionary keys, or value types.

## Presets

Version `1.2.0-beta.1` adds a beginner-oriented preset library for commonly used TriCaster controls.

Preset groups currently include:

- Program
- Preview
- Main Program DSK 1 and DSK 2
- M/E 1 through M/E 8
- Output 2

The presets provide ready-made buttons for common source selections and transitions using the module's dedicated actions and feedbacks.

The module also includes regression-testing preset groups:

- **Regression Testing (Live Safe)**
- **Regression Testing (DO NOT USE WHILE LIVE)**

These are intended for module development and hardware regression testing rather than normal operator use.

Regression presets include representative checks for:

- M/E source and DSK controls
- Companion variables
- Program/Preview tally feedback
- Advanced single-state feedback
- Advanced multiple-condition feedback
- Program/Preview controls
- Main DSK controls
- Output 2 routing

## Feedbacks

The module provides dedicated boolean feedbacks for commonly used TriCaster states.

Companion determines the button styling applied when a boolean feedback is active.

### Program/Preview: Source Selected

Indicates whether a selected source is currently selected on the Main Program or Preview row.

Choose:

**Row**

- Program
- Preview

**Source**

Choose the source to monitor.

The feedback is active while that source exactly matches the source reported by the selected row.

### Program DSK: On Air

Indicates whether Main DSK 1 or Main DSK 2 is contributing to Program.

Choose:

- DSK 1
- DSK 2

The feedback becomes active whenever the selected DSK's reported transition/on-air value is greater than zero.

This means the feedback activates as the DSK begins transitioning on and remains active while the DSK transitions off until its contribution reaches zero.

### Program DSK: Source Selected

Select Main DSK 1 or DSK 2 and the source to monitor.

The feedback becomes active when the selected source is currently selected on that Main DSK.

For numbered framebuffer sources, the module uses the TriCaster's numeric DSK source state because legacy TriCaster systems may report the persistent named source only as `framebuffer`.

### M/E Row: Source Selected

Indicates whether a selected source is currently selected on an M/E A or B row.

Choose:

**M/E**

- M/E 1-8

**Row**

- A
- B

**Source**

Choose the source to monitor.

The feedback becomes active when the selected source exactly matches the source reported by that M/E row.

### M/E DSK: Source Selected

Indicates whether a selected source is currently selected on an M/E DSK.

Choose:

**M/E**

- M/E 1-8

**Source**

Choose the source to monitor.

The feedback becomes active when the selected source is currently selected on that M/E DSK.

For numbered framebuffer sources, the module uses the TriCaster's numeric DSK source state because legacy TriCaster systems may report the persistent named source only as `framebuffer`.

### Output 2: Source Selected

Indicates whether a selected source is currently routed to TriCaster Output 2.

Choose the Output 2 source to monitor.

The feedback becomes active when the selected source exactly matches the source reported by Output 2.

The available choices correspond to the choices provided by the dedicated **Output 2: Set Source** action, including M/E 1-8 where supported.

### DDR: Playing

Indicates whether DDR 1 or DDR 2 is currently playing.

Choose:

- DDR 1
- DDR 2

The feedback becomes active while the selected DDR reports its Play state as true.

### Tally: Source On Program/Preview

Indicates whether a selected source is contributing to Program or Preview according to the TriCaster tally state.

Choose:

**Tally**

- Program
- Preview

**Source**

Choose the source to monitor.

A legacy TriCaster can report multiple sources simultaneously in a pipe-delimited tally value.

For example:

`Input1|Net|BFR5|V5`

The module separates the reported value into individual sources and performs an exact match. This allows a feedback for `Net`, for example, to become active when `Net` appears anywhere in the Program or Preview tally list.

### Advanced: Shortcut State Equals

Monitors any individual shortcut state reported by the TriCaster.

Use a dedicated feedback when one is available for the function you need.

The Advanced feedback provides:

**State Name**

Enter the exact shortcut-state name reported by the TriCaster.

**Expected Value**

Enter the value that should cause the feedback to become active.

For example:

State Name:

`main_output2_select_named_input`

Expected Value:

`program`

The feedback becomes active while the TriCaster reports:

`main_output2_select_named_input = program`

This Advanced feedback is useful for development, troubleshooting, and states that do not yet have dedicated feedbacks.

### Advanced: Shortcut States - Multiple Conditions

Monitors up to four TriCaster shortcut-state conditions simultaneously.

Choose the overall **Match Logic**:

- **AND** - All configured conditions must match
- **OR** - Any configured condition may match

Each condition provides:

**State Name**

The exact shortcut state reported by the TriCaster.

**Comparison**

Choose:

- Equal
- Not Equal

**Expected Value**

The value to compare against the current TriCaster state.

Conditions with a blank State Name are ignored.

For example, an AND feedback could require:

`main_a_row_named_input = Input4`

and:

`main_output2_select_named_input = program`

The feedback becomes active only while both conditions are true.

## Variables

Selected commonly useful `NTK_states` are exposed directly as Companion variables.

The variable ID uses the actual state name reported by the TriCaster. The description shown in Companion explains what that state represents.

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

These variables make useful TriCaster state information available in Companion without requiring verbose logging or creating a feedback button simply to inspect a value.

The exact states and values provided by other legacy TriCaster models may differ.

## Unsupported or Missing States

Different legacy TriCaster models may provide different shortcut states and commands.

A state or command available on an XD860 may not exist on a smaller, older, or differently configured TriCaster.

The module should not assume that every supported TriCaster has the same number of inputs, M/Es, outputs, media players, or other resources.

If a feedback references a state that the connected TriCaster does not provide, the feedback remains inactive.

Variables corresponding to states not supplied by the connected TriCaster may remain unset.

## Connection Recovery

If the persistent state connection to the TriCaster is lost, the module attempts to reconnect automatically.

After reconnecting, the module registers for `NTK_states` again so that state feedback and variables can resume updating.

## Version 1.1.0 Functionality

Version `1.1.0` provides:

- Legacy TriCaster TCP connection on port 5951
- `NTK_states` registration
- Initial shortcut-state reception
- Incremental shortcut-state updates
- Generic shortcut-state parsing
- Dedicated Program/Preview source control
- Dedicated Main Program AUTO and CUT control
- Dedicated Main DSK source and transition controls
- Dedicated M/E A/B row source control
- Dedicated M/E DSK source and transition controls
- Main FX source control
- Output 2 source control including M/E, Program, Preview, Program Clean, and numbered framebuffer choices
- Destination-specific source-choice lists
- GFX1 (Stills) and GFX2 (Titles) friendly source naming
- Dedicated Program/Preview source feedback
- Dedicated Main DSK source-selected and on-air feedback
- Dedicated M/E row and DSK source feedback
- Dedicated M/E DSK on-air feedback
- Dedicated Output 2 source feedback
- LiveMatte toggle action for base sources
- LiveMatte status feedback for base sources
- DDR playing feedback
- Program/Preview tally feedback with multiple-source parsing and numbered framebuffer choices
- Expanded Companion variables for useful TriCaster states
- Case-insensitive matching for dedicated source feedbacks
- Automatic reevaluation of dedicated feedbacks when shortcut states change
- Advanced single-state feedback
- Advanced multiple-condition feedback
- Advanced direct shortcut-command action
- Automatic reconnection of the persistent state connection
- Optional verbose logging
- Dedicated Macro: Run by Name action
- Correct numbered-buffer source feedback for Main and M/E DSKs

Version `1.0.0` was the first stable release and was based on the Beta 1.5 codebase that completed live hardware validation on the tested TriCaster XD860.

Version `1.1.0` preserves that feature set while updating the Companion module API, Node.js runtime, and development toolchain. The existing actions, feedbacks, variables, state handling, and legacy TCP control were regression-tested on the same TriCaster XD860 after the migration and passed without functional regressions.

## Known Limitations and Future Development

Potential future development includes:

- Dedicated DDR/media-player actions based on commands already verified on legacy hardware
- Audio control
- Graphics and media selection
- Additional source-choice discovery
- M/E C and D row behavior
- Additional M/E and FX behavior
- Program transition delegation
- Recording and streaming states where supported
- Additional legacy TriCaster model compatibility
- Reconnection or command error-handling improvements if testing shows they are needed
- Additional dedicated actions and feedbacks based on verified legacy commands
- Generic framebuffer assignment using verified dictionary-style TriCaster commands

Features should be added based on behavior verified on legacy TriCaster hardware rather than assuming that commands or states used by newer TriCaster systems behave identically.

## Tested Hardware

Initial development and state capture:

- NewTek TriCaster XD860
- Product reported by TriCaster: `XD860`
- TriCaster build: `2-6-170817`

Initial Companion development:

- Bitfocus Companion 5.0.3

Additional legacy TriCaster models have not yet been verified.

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

Version `1.1.0` has completed hardware regression testing on the tested TriCaster XD860 running build `2-6-170817`.

Because legacy TriCaster models and software builds may expose different states, commands, and capabilities, verify required functions on your particular system before relying on the module for critical production control or status indication.