import * as prettier from 'prettier';

export const formatFile = (content: string): Promise<string> => {
  return new Promise((res, rej) =>
    prettier.resolveConfig(process.cwd()).then((options) => {
      if (!options) {
        // no prettier configuration was found -> do nothing
        res(content);
      }

      try {
        const formatted = prettier.format(content, {
          ...options,
          parser: 'typescript',
        });

        res(formatted);
      } catch (error) {
        rej(error);
      }
    }),
  );
};
