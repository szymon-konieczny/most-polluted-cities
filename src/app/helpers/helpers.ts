export function removeDuplicates(collection: any[], getIdentifier: any) {
  const identifierState = {};

  return collection.filter(value => {
    const identifier = JSON.stringify(getIdentifier(value));

    if (identifierState[identifier]) {
      return false;
    }

    identifierState[identifier] = true;
    return true;
  });
}
