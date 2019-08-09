export function removeDuplicates<T>(collection: T[], getIdentifier: (data: T) => string): T[] {
  const identifierState = {};

  return collection.filter(value => {
    const identifier: string = JSON.stringify(getIdentifier(value));

    if (identifierState[identifier]) {
      return false;
    }

    identifierState[identifier] = true;
    return true;
  });
}
