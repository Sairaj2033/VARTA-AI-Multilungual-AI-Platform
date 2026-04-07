import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Upload, 
  Play, 
  FileVideo, 
  Mic, 
  FileText, 
  Bot, 
  CheckCircle, 
  Clock,
  MessageSquare,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useLanguage } from "@/contexts/language-context";
import { Link } from "wouter";

interface ProcessingStep {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  active: boolean;
}

export default function VideoAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'analyze',
      icon: Video,
      title: 'Analyzing news video',
      description: 'Processing video metadata and structure',
      duration: 2000,
      completed: false,
      active: false
    },
    {
      id: 'extract',
      icon: Mic,
      title: 'Extracting audio track',
      description: 'Separating audio from video content',
      duration: 3000,
      completed: false,
      active: false
    },
    {
      id: 'transcribe',
      icon: FileText,
      title: 'Transcribing news content',
      description: 'Converting speech to text using AI',
      duration: 4000,
      completed: false,
      active: false
    },
    {
      id: 'summarize',
      icon: Bot,
      title: 'Generating news summary',
      description: 'Creating intelligent summary with AI',
      duration: 3000,
      completed: false,
      active: false
    }
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file (MP4, WebM, AVI, MOV, MKV)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video file smaller than 100MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      
      // Create video preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      
      toast({
        title: "Video uploaded successfully",
        description: `Selected: ${file.name}`
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        const previewUrl = URL.createObjectURL(file);
        setVideoPreview(previewUrl);
        
        toast({
          title: "Video uploaded successfully",
          description: `Selected: ${file.name}`
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive"
        });
      }
    }
  };

  const processVideo = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setIsComplete(false);
    setCurrentStep(0);
    setProcessingProgress(0);

    // Reset steps
    setProcessingSteps(prev => prev.map(step => ({
      ...step,
      completed: false,
      active: false
    })));

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      // Set current step as active
      setProcessingSteps(prev => prev.map((step, index) => ({
        ...step,
        active: index === i,
        completed: index < i
      })));
      
      setCurrentStep(i);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, processingSteps[i].duration));
      
      // Update progress
      setProcessingProgress(((i + 1) / processingSteps.length) * 100);
      
      // Mark step as completed
      setProcessingSteps(prev => prev.map((step, index) => ({
        ...step,
        active: false,
        completed: index <= i
      })));
    }

    // Generate mock summary
    const mockSummary = `This news video discusses recent developments in technology and AI innovation. Key highlights include:

• Major tech companies announcing new AI initiatives
• Government policies on digital transformation
• Market reactions to recent technological breakthroughs
• Expert opinions on future technology trends
• Impact on various industry sectors

The discussion covers both opportunities and challenges in the current technological landscape, with particular focus on AI integration and digital infrastructure development.`;

    setSummary(mockSummary);
    setIsProcessing(false);
    setIsComplete(true);
    
    toast({
      title: "Video analysis complete",
      description: "News summary generated successfully"
    });
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsAnswering(true);
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock answer
    const mockAnswer = `Based on the video content, here's the answer to your question:

The video provides detailed information about ${question.toLowerCase()}. The key points mentioned include technical specifications, market implications, and expert analysis. The discussion also covers potential future developments and their impact on the industry.

This information comes from the transcribed audio content and reflects the main themes discussed in the news segment.`;

    setAnswer(mockAnswer);
    setIsAnswering(false);
  };

  const resetAnalyzer = () => {
    setSelectedFile(null);
    setVideoPreview(null);
    setIsProcessing(false);
    setIsComplete(false);
    setProcessingProgress(0);
    setCurrentStep(0);
    setSummary("");
    setQuestion("");
    setAnswer("");
    setProcessingSteps(prev => prev.map(step => ({
      ...step,
      completed: false,
      active: false
    })));
  };

  return (
    <div className={`min-h-screen bg-background transition-all duration-500 ${theme === 'creative' ? 'creative-bg' : ''}`}>
      {/* Header */}
      <header className="glass-morphism backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover-lift">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to News
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                {theme === 'creative' && <Sparkles className="h-5 w-5 text-primary pulse-subtle" />}
                <h1 className={`text-xl font-bold text-primary ${theme === 'creative' ? 'gradient-primary bg-clip-text text-transparent' : ''}`}>
                  DrishtiSar
                </h1>
              </div>
              <Badge variant="secondary" className="ml-2">
                Video Analyzer
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            News Video Analyzer
          </h2>
          <p className="text-muted-foreground text-lg">
            Transform news videos into intelligent summaries with AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Processing */}
          <div className="space-y-6">
            {!isProcessing && !isComplete && (
              <Card className={`transition-all duration-300 hover:shadow-lg ${theme === 'creative' ? 'glass-morphism' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload News Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-all duration-300 hover:border-primary/50 cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileVideo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      Drop your news video here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supported formats: MP4, WebM, AVI, MOV, MKV
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max size: 100MB | Max duration: 30 minutes
                    </p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {selectedFile && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button onClick={processVideo} className="hover-lift">
                          <Play className="h-4 w-4 mr-2" />
                          Analyze Video
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Processing Panel */}
            {isProcessing && (
              <Card className={`${theme === 'creative' ? 'glass-morphism' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 animate-pulse" />
                    Processing News Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={processingProgress} className="w-full" />
                    
                    <div className="space-y-3">
                      {processingSteps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                            step.active
                              ? 'bg-primary/10 border-primary/20 border'
                              : step.completed
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              step.active
                                ? 'bg-primary/20 animate-pulse'
                                : step.completed
                                ? 'bg-green-100 dark:bg-green-800'
                                : 'bg-muted-foreground/20'
                            }`}>
                              {step.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <step.icon className={`h-4 w-4 ${step.active ? 'text-primary' : 'text-muted-foreground'}`} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{step.title}</p>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {step.duration / 1000}s
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Preview */}
            {videoPreview && (
              <Card className={`${theme === 'creative' ? 'glass-morphism' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <video
                    src={videoPreview}
                    controls
                    className="w-full rounded-lg"
                    style={{ maxHeight: '300px' }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Results */}
          {isComplete && (
            <div className="space-y-6">
              <Card className={`${theme === 'creative' ? 'glass-morphism' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    News Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-line text-foreground">
                      {summary}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${theme === 'creative' ? 'glass-morphism' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Ask About the News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Ask questions about the news content, key facts, or analysis..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button 
                      onClick={handleAskQuestion}
                      disabled={!question.trim() || isAnswering}
                      className="w-full hover-lift"
                    >
                      {isAnswering ? (
                        <>
                          <Bot className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Ask Question
                        </>
                      )}
                    </Button>

                    {answer && (
                      <div className="mt-4 p-4 bg-muted rounded-lg border-l-4 border-primary">
                        <h4 className="font-medium mb-2">Answer:</h4>
                        <div className="whitespace-pre-line text-sm text-foreground">
                          {answer}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={resetAnalyzer} variant="outline" className="flex-1 hover-lift">
                  Analyze Another Video
                </Button>
                <Button asChild className="flex-1 hover-lift">
                  <Link href="/">
                    Back to News Feed
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}