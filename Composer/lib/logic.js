/**
Track the trade of a article from one trader to another
* @param {org.acme.product.auction.Trade} trade - the trade to be processed
* @transaction
*/


function tradeArticle(trade) {
  trade.article.owner = trade.newOwner;
  return getAssetRegistry('org.acme.product.auction.Article')
    .then(function (assetRegistry) {
      return assetRegistry.update(trade.article);
    });
}