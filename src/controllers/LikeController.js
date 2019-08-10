const Dev = require('../models/Dev');

module.exports = {
	async store(req, res) {
		const { devId } = req.params;
		const { user } = req.headers;

		const loggedDev = await Dev.findById(user);
		const targetDev = await Dev.findById(devId);

		if (!targetDev) {
			res.status(400).json({ error: 'Dev not exists' });
        }

        if(targetDev.likes.includes(loggedDev._id)) {
			const loggedSocket = req.connectUsers[user]
			const targetSocket = req.connectUsers[targetDev._id]

			if(loggedDev) {
				req.io.to(loggedSocket).emit('macth', targetDev)
			}

			if(targetSocket) {
				req.io.to(targetSocket).emit('macth', loggedDev)
			}
        }
        
        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

		return res.json(loggedDev);
	}
};
