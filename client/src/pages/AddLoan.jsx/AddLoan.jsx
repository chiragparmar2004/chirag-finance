import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
   ToggleButtonGroup, 
  ToggleButton, 
  FormControl, 
   Autocomplete, 
  CircularProgress, 
  Snackbar, 
  Alert 
} from "@mui/material";

const AddLoan = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    amount: "",
    interest: "",
    startDate: "",
    endDate: "",
    paymentType: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiRequest().get("/user/allMembers");
        setMembers(response.data.data);
      } catch (error) {
        console.error("Error fetching members:", error);
        showSnackbar("Failed to fetch members", "error");
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (formData.startDate) {
      const endDate = new Date(formData.startDate);
      endDate.setDate(endDate.getDate() + 100);
      setFormData((prevFormData) => ({
        ...prevFormData,
        endDate: endDate.toISOString().slice(0, 10),
      }));
    }
  }, [formData.startDate]);

  const handleAmountOptionClick = (amount) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount: amount.toString(),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleMemberChange = (event, newValue) => {
    if (newValue) {
      setFormData({
        ...formData,
        memberId: newValue._id,
        memberName: newValue.name,
      });
    } else {
      setFormData({
        ...formData,
        memberId: "",
        memberName: "",
      });
    }
  };

  const handlePaymentTypeChange = (event, newPaymentType) => {
    if (newPaymentType !== null) {
      setFormData({
        ...formData,
        paymentType: newPaymentType,
      });
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const defaultAmountOptions = [10000, 15000, 20000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.memberId ||
      !formData.amount ||
      !formData.interest ||
      !formData.startDate ||
      !formData.paymentType
    ) {
      showSnackbar("All fields are required", "error");
      return;
    }
    
    setLoading(true);
    try {
      const { memberId, amount, interest, startDate, paymentType } = formData;
      const response = await apiRequest().post(`/loan/addLoan/${memberId}`, {
        amount,
        interest,
        startDate,
        paymentType,
      });

      if (response.status === 201) {
        showSnackbar("Loan Added Successfully", "success");
        setFormData({
          memberId: "",
          memberName: "",
          amount: "",
          interest: "",
          startDate: "",
          endDate: "",
          paymentType: "",
        });
        navigate("/home_page");
      } else {
        const errorMessage =
          response.data?.message || "Failed to add loan. Please try again.";
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error adding loan:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add loan. Please try again.";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
     }}>
      <Paper 
        elevation={8}
        sx={{ 
          maxWidth: "500px", 
          width: "100%", 
          p: 4, 
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
          Add Loan
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Autocomplete
            options={members}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={handleMemberChange}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Member Name" 
                margin="normal" 
                fullWidth 
                required
              />
            )}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <ToggleButtonGroup
            exclusive
            fullWidth
            sx={{ mb: 3 }}
          >
            {defaultAmountOptions.map((option) => (
              <ToggleButton 
                key={option}
                selected={formData.amount === option.toString()}
                onClick={() => handleAmountOptionClick(option)}
                value={option}
                sx={{ 
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }
                }}
              >
                ₹{option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <TextField
            label="Interest Rate"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
            <ToggleButtonGroup
              exclusive
              value={formData.paymentType}
              onChange={handlePaymentTypeChange}
              fullWidth
            >
              <ToggleButton value="cash" sx={{ 
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }
              }}>
                Cash
              </ToggleButton>
              <ToggleButton value="gpay" sx={{ 
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }
              }}>
                GPay
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ 
              py: 1.5,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Loan"
            )}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddLoan;
