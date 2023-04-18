import React from 'react';
import { Button } from '@answeroverflow/discordjs-react';
import {
	InstructionsContainer,
	EmbedMenuInstruction,
	Spacer,
	useHistory,
} from '~discord-bot/components/primitives';
import type { RootChannel } from '~discord-bot/utils/utils';
import {
	ALLOWED_AUTO_THREAD_CHANNEL_TYPES,
	OPEN_QUICK_START_MENU_LABEL,
} from '@answeroverflow/constants';
import {
	// ChannelSettingsMenuItemProps,
	ChannelSettingsSubMenuProps,
	// ChannelSettingsMenuItemProps,
	// updateChannelState,
	ToggleIndexingButton,
	ToggleAutoThreadButton,
	ToggleMarkAsSolutionButton,
} from './channel-settings-menu';
import LRUCache from 'lru-cache';

// import { ChannelType } from 'discord.js';
import type { ChannelWithFlags } from '@answeroverflow/prisma-types';
// import type { Message } from '@answeroverflow/db';
import type { NewsChannel, TextChannel } from 'discord.js';

const channelCache = new LRUCache<string, ChannelWithFlags>({
	max: 500,
	ttl: 1000 * 60 * 5,
});

export function QuickStartEnableAutoThreadMenu({
	targetChannel,
	initialChannelData,
}: ChannelSettingsSubMenuProps) {
	const [channel, setChannel] = React.useState<ChannelWithFlags>(
		channelCache.get(targetChannel.id) ?? initialChannelData,
	);
	//TODO: Use this for the Forum Consent Policy and Enable Solution Tagging
	// const isButtonInForumChannel = targetChannel.type === ChannelType.GuildForum;
	return (
		<>
			{/* Flow for if  AutoThreading is Available*/}
			{ALLOWED_AUTO_THREAD_CHANNEL_TYPES.has(targetChannel.type) && (
				<>
					<InstructionsContainer>
						** Quick Config - Auto Threading ✅**
						<Spacer count={2} />
						<>
							This channel is eligible for auto-threading, do you want to enable
							it?
						</>
					</InstructionsContainer>
					<ToggleAutoThreadButton
						channelInDB={channel}
						setChannel={setChannel}
						targetChannel={targetChannel as TextChannel | NewsChannel}
					/>
				</>
			)}
			{/* Flow for if  AutoThreading is Available*/}
			{ALLOWED_AUTO_THREAD_CHANNEL_TYPES.has(targetChannel.type) && (
				<>
					<InstructionsContainer>
						** Quick Config - Auto Threading ❌**
						<Spacer count={2} />
						<>
							This channel is not eligible for auto-threading, so let's move to
							the next step.{' '}
						</>
					</InstructionsContainer>
				</>
			)}
		</>
	);
}

export function QuickStartEnableIndexingMenu({
	targetChannel,
	initialChannelData,
}: ChannelSettingsSubMenuProps) {
	const [channel, setChannel] = React.useState<ChannelWithFlags>(
		channelCache.get(targetChannel.id) ?? initialChannelData,
	);
	return (
		<>
			<InstructionsContainer>
				** Quick Start - Enable Indexing **
				<Spacer count={2} />
				<EmbedMenuInstruction
					instructions={[
						{
							title: 'Indexing',
							enabled: channel.flags.indexingEnabled,
							instructions: `Disable indexing for the \`#${targetChannel.name}\` channel`,
						},
					]}
				/>
			</InstructionsContainer>
			<ToggleIndexingButton
				channelInDB={channel}
				setChannel={setChannel}
				targetChannel={targetChannel}
			/>
		</>
	);
}

export function QuickStartMenu({
	channelWithFlags,
	targetChannel,
}: {
	channelWithFlags: ChannelWithFlags;
	targetChannel: RootChannel;
}) {
	const [channel] = React.useState<ChannelWithFlags>(
		channelCache.get(targetChannel.id) ?? channelWithFlags,
	);
	const { pushHistory } = useHistory();
	return (
		<>
			<InstructionsContainer>
				** Quick Config Menu **
				<Spacer count={2} />
				<EmbedMenuInstruction
					instructions={[
						{
							title: OPEN_QUICK_START_MENU_LABEL,
							enabled: true,
							instructions:
								'Configure the channel settings quickly. This menu is a guided walkthrough of the full channel settings menu.',
						},
					]}
				/>
			</InstructionsContainer>
			<Button
				label={OPEN_QUICK_START_MENU_LABEL}
				style="Primary"
				onClick={() => {
					pushHistory(
						<QuickStartEnableIndexingMenu
							initialChannelData={channel}
							targetChannel={targetChannel}
						/>,
					);
				}}
			/>
		</>
	);
}
