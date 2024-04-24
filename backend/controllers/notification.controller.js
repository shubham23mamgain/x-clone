import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    if (!notifications)
      return res.status(404).json({ message: "No notifications found" });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId });

    if (notifications.length == 0) {
      return res.status(404).json({ message: "No notifications found" });
    } else {
      await Notification.deleteMany({ to: userId });
      return res
        .status(200)
        .json({ message: "Notifications deleted successfully" });
    }
  } catch (error) {
    console.log("Error in deleteNotifications function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const deleteSingleNotification = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const notificationId = req.params.id;

//     const notification = await Notification.findById(notificationId);

//     if (!notification) {
//       return res.status(404).json({ message: "No notification with ID found" });
//     }
//     if (notification.to.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ message: "You are not allowed to delete this notification" });
//     }
//     await Notification.findByIdAndDelete(notificationId);
//     res.status(200).json({ message: "Notification deleted successfully" });
//   } catch (error) {
//     console.log("Error in deleteNotifications function", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
