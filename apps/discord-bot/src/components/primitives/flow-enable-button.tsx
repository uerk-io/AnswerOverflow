import { Button } from '@answeroverflow/discordjs-react';
import type { ButtonInteraction } from 'discord.js';
import React from 'react';

export type EnableButtonProps = {
	currentlyEnabled: boolean;
	enableLabel: string;
	disableLabel: string;
	disabled?: boolean;
	onClick?: (
		event: ButtonInteraction,
		enabled: boolean,
	) => unknown | Promise<unknown>;
};

/*
 * This is a button that can be used to enable a feature with a following flow to the next menu item.
 */

export function EnableButton({
	currentlyEnabled,
	enableLabel,
	disableLabel,
	onClick,
	disabled = false,
}: EnableButtonProps) {
	const label = currentlyEnabled ? disableLabel : enableLabel;
	const style = currentlyEnabled ? 'Danger' : 'Success';
	return (
		<Button
			label={label}
			disabled={disabled}
			style={disabled ? 'Secondary' : style}
			onClick={(interaction) =>
				onClick ? onClick(interaction, !currentlyEnabled) : null
			}
		/>
	);
}

