import currenciesRules from './currencies-regex.json'

export const valiateAddress = (currency, address) => {
	if (currenciesRules[currency?.toLowerCase()]) {
		const matches = address.match(currenciesRules[currency?.toLowerCase()].regEx);
		if (matches) {
			return true;
		}
		return false;
	}
	return true;
  }
  
export const valiateExternalId = (currency, id) => {
	const ticker = currency?.toLowerCase();
	if (currenciesRules[ticker] && currenciesRules[ticker].regExTag) {
		const matches = id.match(currenciesRules[ticker].regExTag);
		if (matches) {
			return true;
		}
		return false;
	}
	return true;
}