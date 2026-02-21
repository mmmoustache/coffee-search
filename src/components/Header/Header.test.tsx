import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/Header/Header';

vi.mock('@/consts/label', () => ({
  GITHUB_LINK_LABEL: 'GitHub repository',
  GITHUB_URL: 'https://github.com/example/repo',
  SITE_LOGO: 'My Coffee {icon}',
}));

const interpolateMock = vi.fn();
vi.mock('@/utils/interpolate', () => ({
  interpolate: (...args: any[]) => interpolateMock(...args),
}));

function getXlinkHref(el: Element) {
  return el.getAttribute('xlink:href') ?? el.getAttribute('xlinkHref');
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    interpolateMock.mockImplementation((_template: string, values: any) => (
      <>My Coffee {values.icon}</>
    ));
  });

  it('calls interpolate with SITE_LOGO and an icon element', () => {
    render(<Header />);

    expect(interpolateMock).toHaveBeenCalledTimes(1);

    const [template, values] = interpolateMock.mock.calls[0];
    expect(template).toBe('My Coffee {icon}');
    expect(values).toHaveProperty('icon');
    expect(React.isValidElement(values.icon)).toBe(true);
  });

  it('renders the "New search" home link and search icon sprite', () => {
    render(<Header />);

    const searchLink = screen.getByRole('link', { name: /new search/i });
    expect(searchLink).toHaveAttribute('href', '/');

    const use = searchLink.querySelector('use');
    expect(use).not.toBeNull();
    expect(getXlinkHref(use!)).toBe('/icons/icons.svg#search');
  });

  it('renders the centre logo link to "/" with interpolated content', () => {
    render(<Header />);

    const logoLink = screen.getAllByRole('link').find((a) => a.textContent?.includes('My Coffee'));

    expect(logoLink).toBeDefined();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders the GitHub link with correct attrs and github icon sprite', () => {
    render(<Header />);

    const githubLink = screen.getByRole('link', { name: 'GitHub repository' });

    expect(githubLink).toHaveAttribute('href', 'https://github.com/example/repo');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const use = githubLink.querySelector('use');
    expect(use).not.toBeNull();
    expect(getXlinkHref(use!)).toBe('/icons/icons.svg#github');
  });
});
