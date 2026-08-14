# NewTek TriCaster Legacy

A Bitfocus Companion module for older NewTek TriCaster systems that use the legacy TCP control and state interface.

> **Beta Software**
>
> This module is under active development. It has been developed and initially tested for a NewTek TriCaster XD860 running build 2-6-170817. Other legacy TriCaster models may expose different states or fewer features.

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

Enables logging of the raw information received from the TriCaster.

This is primarily intended for:

- Troubleshooting
- Discovering state names
- Development
- Testing additional TriCaster models

Verbose logging may generate a large amount of information and normally should be disabled after testing.

## Feedbacks

### Shortcut State Equals

This is the primary feedback available in the initial beta.

The feedback becomes active when a specified TriCaster shortcut state equals the specified value.

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

## Unsupported or Missing States

Different legacy TriCaster models may provide different shortcut states.

A state available on an XD860 may not exist on a smaller or older TriCaster.

The module should not assume that every supported TriCaster has the same number of inputs, M/Es, outputs, media players, or other resources.

If a feedback references a state that the connected TriCaster does not provide, the feedback will remain inactive.

## Connection Recovery

If the connection to the TriCaster is lost, the module will attempt to reconnect automatically.

After reconnecting, the module registers for `NTK_states` again so that state feedback can resume.

## Current Beta Functionality

The initial beta provides:

- Legacy TriCaster TCP connection on port 5951
- `NTK_states` registration
- Initial shortcut-state reception
- Incremental shortcut-state updates
- Generic shortcut-state parsing
- `Shortcut State Equals` feedback
- Automatic reconnection
- Optional verbose logging

## Planned Development

Future versions are expected to add user-friendly feedbacks and variables for commonly used TriCaster functions while retaining the generic shortcut-state system.

Potential areas include:

- Main switcher A/Program row
- Main switcher B/Preview row
- Main and secondary output assignments
- M/E source and configuration states
- DSK states
- DDR/media player states
- Recording and streaming states where supported
- Companion variables for reported TriCaster states
- Improved state discovery and diagnostics

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