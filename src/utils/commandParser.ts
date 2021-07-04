export function commandParser(content: string): any {
  if (!content) return null;
  const variableValues = content.split('; ');

  const params = {};
  for (const variableValue of variableValues) {
    const [variable, value] = variableValue.split('=');
    params[variable] = value;
  }

  return params;
}
