# NewTek TriCaster Legacy

A Bitfocus Companion module for older NewTek TriCaster systems that use the legacy TCP control and state interface.

> **Beta Software**
>
> This module is under active development. It has been developed and initially tested with a NewTek TriCaster XD860 running build 2-6-170817. Other legacy TriCaster models may expose different states or fewer features.

## Why This Module Exists

Older NewTek TriCaster systems use a different control and feedback interface than newer TriCaster models.

The current NewTek TriCaster Companion module is designed for the newer command/API system and may not provide feedback from older systems such as the TriCaster XD860.

This module is intended to provide Companion integration for those older TriCaster systems.

## Connection

Enter the IP address of the TriCaster in the module configuration.

The module connects to:

- TCP port: `5951`
- State registration: `NTK_states`

After connecting, the module sends:

`<register name="NTK_states"/>`

The TriCaster then reports its available shortcut states and subsequent state changes.

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

### Send Shortcut Command

Version `1.0.0-beta.1.2` adds a generic action for sending legacy TriCaster shortcut commands directly over TCP port `5951`.

The action provides:

**Shortcut Name**

Enter the TriCaster shortcut command name.

Example:

`main_a_row_named_input`

**Value**

Enter the value to send with the shortcut command.

Example:

`input1`

This example sends:

```xml
<shortcut name='main_a_row_named_input' value='input1' />
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

Each action execution creates a temporary TCP connection to port `5951`, sends the command, and closes that command connection. This is separate from the persistent connection used to receive `NTK_states`.

The generic action intentionally allows arbitrary shortcut names and values so that additional legacy TriCaster commands can be tested without requiring a new module build.

Available shortcut commands and accepted values may differ between TriCaster models and software versions. Test commands on the specific TriCaster before relying on them for production control.

## Feedbacks

### Shortcut State Equals

This feedback monitors one TriCaster shortcut state.

Two fields are provided:

**State Name**

The exact shortcut state reported by the TriCaster.

**Expected Value**

The value that should cause the feedback to become active.

For example:

State Name:

`main_output2_select_named_input`

Expected Value:

`program`

The feedback will be active while the TriCaster reports:

`main_output2_select_named_input = program`

If the operator changes Output 2 to another source, the TriCaster reports the state change and the feedback becomes inactive.

This allows a Companion button to indicate whether the TriCaster is actually in the desired state rather than merely indicating that a command was previously sent.

### Shortcut States - Multiple Conditions

This feedback monitors up to four TriCaster shortcut-state conditions at the same time.

Choose the overall **Match Logic**:

- **AND** - All configured conditions must match.
- **OR** - Any configured condition may match.

Each condition provides:

**State Name**

The exact shortcut state reported by the TriCaster.

**Comparison**

Choose:

- **Equal**
- **Not Equal**

**Expected Value**

The value to compare against the current TriCaster state.

Conditions with a blank State Name are ignored.

For example, an AND feedback could require:

`main_a_row_named_input = Input4`

and:

`main_output2_select_named_input = program`

The feedback would become active only while both conditions are true.

The original `Shortcut State Equals` feedback remains available when only a single state comparison is required.

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

These variables make useful TriCaster state information available in Companion without requiring verbose logging or creating a feedback button simply to inspect a value.

The exact states and values provided by other legacy TriCaster models may differ.

## Unsupported or Missing States

Different legacy TriCaster models may provide different shortcut states.

A state available on an XD860 may not exist on a smaller or older TriCaster.

The module should not assume that every supported TriCaster has the same number of inputs, M/Es, outputs, media players, or other resources.

If a feedback references a state that the connected TriCaster does not provide, the feedback will remain inactive.

Variables corresponding to states not supplied by the connected TriCaster may remain unset.

## Connection Recovery

If the connection to the TriCaster is lost, the module will attempt to reconnect automatically.

After reconnecting, the module registers for `NTK_states` again so that state feedback and variables can resume updating.

## Current Beta Functionality

The current development beta provides:

- Legacy TriCaster TCP connection on port 5951
- `NTK_states` registration
- Initial shortcut-state reception
- Incremental shortcut-state updates
- Generic shortcut-state parsing
- Single-state `Shortcut State Equals` feedback
- Multiple-condition shortcut-state feedback
- AND or OR matching of multiple conditions
- Equal or Not Equal comparison for each multiple condition
- Companion variables for selected useful TriCaster states
- Generic `Send Shortcut Command` action
- Temporary TCP port 5951 command connection separate from the persistent state connection
- Support for shortcut commands with or without a Value
- Automatic reconnection of the persistent state connection
- Optional verbose logging

The multiple-condition feedback and Companion variables introduced in `1.0.0-beta.1.1` have not yet completed live TriCaster testing.

The generic `Send Shortcut Command` action introduced in `1.0.0-beta.1.2` has also not yet completed live TriCaster testing.

## Planned Development

Future development is expected to expand the legacy TriCaster integration while retaining the generic shortcut-state and shortcut-command systems.

Potential areas include:

- Additional useful state variables
- Additional state discovery and diagnostics
- DDR/media player states
- Recording and streaming states where supported
- Predefined dropdowns for verified TriCaster shortcut commands
- User-friendly actions for commonly used TriCaster controls
- Multi-step actions combining multiple verified shortcut commands

The generic command action in `1.0.0-beta.1.2` is intended to help verify legacy shortcut commands before they are incorporated into more specialized actions.

Features will be implemented so that states or capabilities missing from a particular legacy TriCaster do not prevent the module from operating.

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
- Whether the module connects successfully
- Relevant verbose log output
- Description of the state or function being tested

Do not include passwords, API credentials, or other sensitive information in logs or public issue reports.

## Beta Warning

This is pre-release software.

Do not rely on this module as the sole control or status indication for critical production functions until the required behavior has been tested on your particular TriCaster and Companion installation.