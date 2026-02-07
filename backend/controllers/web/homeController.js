

const home = async (req, res) => {
	res.status(200).json({ message: "home page" });
};


module.exports = {

	home
}
