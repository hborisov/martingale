module.exports = function(preparedStatement) {
	var statement = preparedStatement;

	var _setParameter = function(parameterPosition, parameterValue) {
		var pattern = '%' + parameterPosition;
		parameterValue = parameterValue.replace("'", "\\'");
		statement = statement.replace(pattern, "'" + parameterValue + "'");
	};

	var result = {};
	result.setParameter = function(par1, par2) {
		_setParameter(par1, par2);
	};
	result.getQuery = function() {
		return statement;
	};
	return result;
}