import { User } from '../user-repo';

const toCamelCase = (
  rows: {
    [key: string]: User;
  }[]
) => {
  return rows.map((row) => {
    const replaced: { [key: string]: User } = {};

    for (let key in row) {
      const camelCase = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace('_', '')
      );

      replaced[camelCase] = row[key];
    }

    return replaced;
  });
};

export default toCamelCase;
