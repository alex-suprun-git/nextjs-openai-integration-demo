import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Alert from '.';

describe('Alert', () => {
	enum AlertTypes {
		'info' = 'info',
		'warning' = 'warning',
		'error' = 'error',
		'success' = 'success',
	}

	it('renders with default info type when no type is provided', () => {
		const { container } = render(<Alert>Sample alert text</Alert>);
		expect(container).toMatchSnapshot();
		expect(screen.getByRole('alert')).toHaveClass('alert alert-info');
	});

	const types = ['info', 'warning', 'error', 'success'] as AlertTypes[];
	types.forEach((type) => {
		it(`renders correctly for type ${type}`, () => {
			render(<Alert type={type}>Sample alert text</Alert>);
			const expectedClass =
				type === 'error'
					? 'alert alert-error text-white bg-red-800'
					: `alert alert-${type}`;
			expect(screen.getByRole('alert')).toHaveClass(expectedClass);
		});
	});

	it('renders children correctly', () => {
		const testMessage = 'This is a test message';
		render(<Alert>{testMessage}</Alert>);
		expect(screen.getByText(testMessage)).toBeInTheDocument();
	});
});
