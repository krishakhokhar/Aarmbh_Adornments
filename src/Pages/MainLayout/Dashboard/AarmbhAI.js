import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Chip, Box } from '@mui/material';
import { Sparkles, Send } from 'lucide-react';
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

// Lightweight, dependency-free formatter for Groq's markdown-ish replies:
// renders "**bold**", "- bullet" / "* bullet" lines, and "# Heading" lines
// as real elements instead of dumping raw markdown syntax on screen.
const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
    });
};

const formatAnswer = (answer) => {
    const lines = answer.split('\n').filter((l) => l.trim() !== '');
    const blocks = [];
    let currentList = [];

    const flushList = () => {
        if (currentList.length) {
            blocks.push(<ul key={`list-${blocks.length}`} style={{ margin: '4px 0 8px', paddingLeft: 20 }}>{currentList}</ul>);
            currentList = [];
        }
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (/^[-*•]\s+/.test(trimmed)) {
            currentList.push(<li key={idx} style={{ marginBottom: 2 }}>{renderInline(trimmed.replace(/^[-*•]\s+/, ''))}</li>);
        } else if (/^#{1,3}\s+/.test(trimmed)) {
            flushList();
            blocks.push(
                <Typography key={idx} variant="subtitle2" fontWeight={700} sx={{ mt: 1 }}>
                    {renderInline(trimmed.replace(/^#{1,3}\s+/, ''))}
                </Typography>
            );
        } else {
            flushList();
            blocks.push(
                <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                    {renderInline(trimmed)}
                </Typography>
            );
        }
    });
    flushList();
    return blocks;
};

const AarmbhAI = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [insight, setInsight] = useState('');
    const [insightLoading, setInsightLoading] = useState(true);
    const [insightError, setInsightError] = useState(false);

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
                } else if (!cancelled) {
                    setInsightError(true);
                }
            })
            .catch(() => {
                // Safe fallback only - never breaks the dashboard.
                if (!cancelled) setInsightError(true);
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
                        sx={{
                            background: 'linear-gradient(135deg, #0d3b3d 0%, #12494b 60%, #175456 100%)',
                            color: 'white',
                            border: '1px solid #1a5052',
                            boxShadow: '0 10px 34px rgba(13,59,61,0.28)',
                        }}
                    >
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                <Sparkles size={22} color="#d9b45c" />
                                <Typography variant="h6" fontWeight="bold">Ask Aarmbh AI</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                                Get intelligent insights from your jewelry business data.
                            </Typography>

                            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                                {QUICK_QUESTIONS.map(({ label, question: q }) => (
                                    <Chip
                                        key={label}
                                        label={label}
                                        onClick={() => askAI(q)}
                                        disabled={loading}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.12)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            border: '1px solid rgba(255,255,255,0.18)',
                                            '&:hover': { bgcolor: 'rgba(217,180,92,0.25)' },
                                        }}
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
                                    endIcon={<Send size={16} />}
                                    onClick={() => askAI()}
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: '#d9b45c',
                                        color: '#0d3b3d',
                                        fontWeight: 700,
                                        '&:hover': { backgroundColor: '#e6c866' },
                                    }}
                                >
                                    Ask AI
                                </Button>
                            </Box>

                            {loading && (
                                <Box mt={2}>
                                    <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
                                        Analyzing your business data...
                                    </Typography>
                                    <Box className="aarmbh-skeleton-line" sx={{ width: '90%', mb: 0.8 }} />
                                    <Box className="aarmbh-skeleton-line" sx={{ width: '70%', mb: 0.8 }} />
                                    <Box className="aarmbh-skeleton-line" sx={{ width: '50%' }} />
                                </Box>
                            )}
                            {!loading && error && (
                                <Typography variant="body2" mt={2} sx={{ color: '#ffcdd2' }}>
                                    {error}
                                </Typography>
                            )}
                            {!loading && !error && answer && (
                                <Box mt={2} p={2} sx={{ bgcolor: 'rgba(255,255,255,0.94)', color: '#262a28', borderRadius: 2 }}>
                                    {formatAnswer(answer)}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12">
                    <div className="aarmbh-card" style={{ padding: '18px 20px', borderLeft: '4px solid #b8923a' }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                            ✨ AI Business Insight
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {insightLoading
                                ? 'Analyzing your business data...'
                                : insightError
                                    ? 'AI insight is temporarily unavailable - your dashboard data above is unaffected.'
                                    : (insight || 'No insight available right now - check back once you have some sales and inventory data.')}
                        </Typography>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AarmbhAI;
