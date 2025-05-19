import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiRequest from "../../lib/apiRequest";

const AddMember = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData);
      await apiRequest().post("/user/add_member", {
        name: inputs.name,
        mobileNumber: inputs.mobileNumber,
      });
      toast.success("Member added successfully");
      navigate("/home_page");
    } catch (error) {
      console.log(error, "error in addMember");
      toast.error("Something went wrong");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100%"
      // bgcolor="#f0f0f0"
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
          // transform: "scale(1.1)",
          // bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h5" textAlign="center" mb={4} fontWeight="bold">
          Add Member
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Full Name"
            fullWidth
            required
            variant="outlined"
            margin="normal"
          />
          <TextField
            name="mobileNumber"
            label="Mobile Number"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#1976d2",
              ":hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Add Member
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddMember;
