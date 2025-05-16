router.delete('/:commentId',  async (req, res) => {
    try {
      const { commentId } = req.params;
  
      const comment = await Commentdb.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found.' });
      }
  
      // Ensure only the author can delete their comment
      if (comment.User_Id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized action.' });
      }
  
      await Commentdb.findByIdAndDelete(commentId);
  
      res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Error deleting comment.', error });
    }
  });