export const longName = {  
	bnbmainnet: { 
		ticker: 'bnb',
		sub: 'mainnet'
	},
	usdterc20 : {
		ticker: 'usdt',
		sub: 'erc20'
	}
};
  
export const errorType = {
	INACTIVE: 'pair_is_inactive',
	SMALL_DEPOSIT: 'deposit_too_small'
}
  
export const statuses = {
	waiting: 'waiting', 
	confirming:  'confirming', 
	exchanging: 'exchanging', 
	sending: 'sending', 
	finished: 'finished',
	failed: 'failed',
	refunded: 'refunded', 
	expired: 'expired'
  };
  
export const finishedStatuses = [ 'finished', 'failed', 'refunded', 'expired' ];