import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Chip, Box } from '@mui/material';
import { Sparkles } from 'lucide-react';
import axios from 'axios';
import API from '../../../Server';

const QUICK_QUESTIONS = [
    { label: 'Total Sales', question: 'What are my total sales?' },
    { label: 'Top Selling Products', question: 'What are my top-selling products?' },
    { label: 'Low Stock', question: 'Which products have low stock?' },
    { label: 'Monthly Summary', question: "Give me a summary of this month's sales and purchases." },
    { label: 'Purchase Summary', question: 'What were my purchases this month?' },
    { label: 'Restock Suggestions', question: 'Which products should I restock?' },
];

const FRIENDLY_ERROR = 'AI is temporarily unavailable. Please try again.';

const AarmbhAI = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [insight, setInsight] = useState('');
    const [insightLoading, setInsightLoading] = useState(true);

    const askAI = async (customQuestion) => {
        const q = (customQuestion || question).trim();
        if (!q) {
            setError('Please enter a question.');
            return;
        }
        setLoading(true);
        setError('');
        setAnswer('');
        try {
            const response = await axios.post(API.askAI, { question: q }, { timeout: 30000 });
            if (response.data && response.data.success) {
                setAnswer(response.data.answer);
            } else {
                setError((response.data && response.data.message) || FRIENDLY_ERROR);
            }
        } catch (err) {
            setError(err.response?.data?.message || FRIENDLY_ERROR);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        axios
            .post(API.askAI, { question: 'Give me one short, specific insight about my business based on current inventory and sales data.' }, { timeout: 30000 })
            .then((response) => {
                if (!cancelled && response.data && response.data.success) {
                    setInsight(response.data.answer);
                }
            })
            .catch(() => {
                // Safe fallback only - never breaks the dashboard.
            })
            .finally(() => {
                if (!cancelled) setInsightLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    return (
        <>
            <div className="row mt-3">
                <div className="col-12">
                    <Card
                        className="shadow-sm"
                        sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #0d3b3d 0%, #114d4f 100%)', color: 'white' }}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                <Sparkles size={22} />
                                <Typography variant="h6" fontWeight="bold">Ask Aarmbh AI</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                                Get intelligent insights from your business data.
                            </Typography>

                            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                                {QUICK_QUESTIONS.map(({ label, question: q }) => (
                                    <Chip
                                        key={label}
                                        label={label}
                                        onClick={() => askAI(q)}
                                        disabled={loading}
                                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer' }}
                                    />
                                ))}
                            </Box>

                            <Box display="flex" gap={1} flexWrap="wrap">
                                <TextField
                                    fullWidth
                                    placeholder="Ask about your sales, inventory or business..."
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            askAI();
                                        }
                                    }}
                                    variant="outlined"
                                    size="small"
                                    disabled={loading}
                                    sx={{ flex: 1, minWidth: 220, bgcolor: 'white', borderRadius: 1 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => askAI()}
                                    disabled={loading}
                                    style={{ backgroundColor: '#d4af37', color: '#0d3b3d', textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Ask AI
                                </Button>
                            </Box>

                            {loading && (
                                <Typography variant="body2" mt={2} sx={{ opacity: 0.85 }}>
                                    Analyzing your business data...
                                </Typography>
                            )}
                            {!loading && error && (
                                <Typography variant="body2" mt={2} sx={{ color: '#ffcdd2' }}>
                                    {error}
                                </Typography>
                            )}
                            {!loading && !error && answer && (
                                <Box mt={2} p={2} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, whiteSpace: 'pre-line' }}>
                                    <Typography variant="body2">{answer}</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12">
                    <Card className="shadow-sm" sx={{ borderRadius: 3, borderLeft: '4px solid #d4af37' }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                                AI Business Insight
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {insightLoading
                                    ? 'Analyzing your business data...'
                                    : (insight || 'No insight available right now - check back once you have some sales and inventory data.')}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default AarmbhAI;
