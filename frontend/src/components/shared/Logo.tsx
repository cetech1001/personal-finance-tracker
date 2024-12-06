import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const Logo = (props: SvgIconProps) => (
	<SvgIcon
		{...props}
		viewBox="0 0 64 64"
		sx={{ width: 100, height: 100, ...props.sx }}
	>
		<circle cx="32" cy="32" r="30" fill="#4CAF50" />

		<path
			d="M16 40 L24 32 L32 40 L48 24"
			stroke="#FFFFFF"
			strokeWidth="4"
			fill="none"
		/>
		<polygon points="44,24 48,24 48,28" fill="#FFFFFF" />

		<text
			x="32"
			y="28"
			textAnchor="middle"
			fontSize="18"
			fontWeight="bold"
			fill="#FFFFFF"
		>
			£
		</text>
	</SvgIcon>
);
