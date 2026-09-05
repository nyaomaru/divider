import { emailDivider } from '../../src/presets/email-divider';

describe('emailDivider', () => {
  it('should return ["user", "domain.com"] for a standard email', () => {
    const input = 'user@domain.com';

    const result = emailDivider(input);

    expect(result).toEqual(['user', 'domain.com']);
  });

  it('should return ["user"] when domain is missing', () => {
    const input = 'user@';

    const result = emailDivider(input);

    expect(result).toEqual(['user']);
  });

  it('should return ["domain.com"] when local part is missing', () => {
    const input = '@domain.com';

    const result = emailDivider(input);

    expect(result).toEqual(['domain.com']);
  });

  it('should return [] when both parts are missing', () => {
    const input = '@';

    const result = emailDivider(input);

    expect(result).toEqual([]);
  });

  it('should return entire input when "@" is not present', () => {
    const input = 'noatsymbol';

    const result = emailDivider(input);

    expect(result).toEqual(['noatsymbol']);
  });

  it('should handle invalid runtime input gracefully', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = emailDivider(null as unknown as string);

    expect(result).toEqual([]);
    expect(warnSpy).toHaveBeenCalledWith(
      "divider: 'input' must be a string or an array of strings. So returning an empty array.",
    );

    warnSpy.mockRestore();
  });

  it('should return all segments and log a warning when multiple "@" are present', () => {
    const input = 'a@b@c';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = emailDivider(input);

    expect(result).toEqual(['a', 'b', 'c']);
    expect(warnSpy).toHaveBeenCalledWith(
      `[divider/emailDivider] Too many "@" symbols in "${input}". Expected at most one.`
    );

    // Cleanup
    warnSpy.mockRestore();
  });

  it('should warn when consecutive "@" symbols produce an empty segment', () => {
    const input = 'a@@b';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = emailDivider(input);

    expect(result).toEqual(['a', 'b']);
    expect(warnSpy).toHaveBeenCalledWith(
      `[divider/emailDivider] Too many "@" symbols in "${input}". Expected at most one.`
    );

    warnSpy.mockRestore();
  });

  it('should not split a domain when repeated "@" symbols are present', () => {
    const input = 'a@@b.example';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = emailDivider(input, { splitTLD: true });

    expect(result).toEqual(['a', 'b.example']);

    warnSpy.mockRestore();
  });

  it('should trim whitespace if trim option is enabled', () => {
    const input = '  user@domain.com  ';
    const options = { trim: true };

    const result = emailDivider(input, options);

    expect(result).toEqual(['user', 'domain.com']);
  });

  it('should split domain into subdomain and TLD when splitTLD is true', () => {
    const input = 'user@sub.example.com';
    const options = { splitTLD: true };

    const result = emailDivider(input, options);

    expect(result).toEqual(['user', 'sub', 'example', 'com']);
  });

  it('should not split domain when splitTLD is false', () => {
    const input = 'user@sub.example.com';
    const options = { splitTLD: false };

    const result = emailDivider(input, options);

    expect(result).toEqual(['user', 'sub.example.com']);
  });

  it('should return original result if splitTLD is true but "@" is not present', () => {
    const input = 'plainstring';
    const options = { splitTLD: true };

    const result = emailDivider(input, options);

    expect(result).toEqual(['plainstring']);
  });
});
