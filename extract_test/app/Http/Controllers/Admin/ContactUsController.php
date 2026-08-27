<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactUsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ContactUs::query();

        // Optional search functionality
        if ($request->has('search') && $request->search != '') {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%")
                    ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        $contacts = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/ContactUs/Index', [
            'contacts' => $contacts,
            'search' => $request->search ?? '',
        ]);
    }

    /**
     * Mark a specific message as read.
     */
    public function markAsRead($id)
    {
        $contact = ContactUs::findOrFail($id);

        if (! $contact->is_seen) {
            $contact->is_seen = true;
            $contact->save();
        }

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $contact = ContactUs::findOrFail($id);
        $contact->delete();

        return redirect()->back()->with('success', 'Message deleted successfully.');
    }

    /**
     * AI analysis of the contact message.
     */
    public function aiAnalyze($id)
    {
        $contact = ContactUs::findOrFail($id);
        $message = strtolower($contact->message);

        $category = 'General Inquiry';
        $priority = 'Low';
        $reply = '';

        // Heuristic AI rules
        if (strpos($message, 'urgent') !== false || strpos($message, 'help') !== false || strpos($message, 'problem') !== false || strpos($message, 'error') !== false || strpos($message, 'emergency') !== false) {
            $priority = 'High';
        } elseif (strpos($message, 'admission') !== false || strpos($message, 'course') !== false || strpos($message, 'enroll') !== false) {
            $priority = 'Medium';
        }

        if (strpos($message, 'course') !== false || strpos($message, 'training') !== false || strpos($message, 'admission') !== false || strpos($message, 'fee') !== false) {
            $category = 'Admission & Courses';
            $reply = "Dear {$contact->name},\n\nThank you for reaching out to BDNSI. We appreciate your interest in our training programs!\n\nRegarding your inquiry about our courses and admission process, our upcoming batch is starting soon. You can find detailed information about course fees, duration, and curriculum on our website.\n\nIf you would like to proceed with enrollment, please reply to this email or visit our campus with 2 passport-size photos and a copy of your NID/Birth Certificate.\n\nBest regards,\nBDNSI Admission Team";
        } elseif (strpos($message, 'certificate') !== false || strpos($message, 'result') !== false || strpos($message, 'exam') !== false) {
            $category = 'Academic Support';
            $reply = "Dear {$contact->name},\n\nThank you for contacting BDNSI Academic Support.\n\nRegarding your query about exams/certificates, please note that all official results and certificates are published on our student portal. If you are unable to find yours, please share your Registration Number and Batch Details by replying to this email, and our academic team will investigate it immediately.\n\nBest regards,\nBDNSI Academic Dept.";
        } elseif (strpos($message, 'login') !== false || strpos($message, 'password') !== false || strpos($message, 'account') !== false || strpos($message, 'website') !== false || strpos($message, 'error') !== false) {
            $category = 'Technical Support';
            $reply = "Dear {$contact->name},\n\nWe apologize for any inconvenience you are facing.\n\nOur technical team has received your report. Could you please provide a screenshot of the issue or elaborate slightly more on what device/browser you are using? This will help us resolve the issue much faster.\n\nBest regards,\nBDNSI IT Support";
        } elseif (strpos($message, 'job') !== false || strpos($message, 'career') !== false || strpos($message, 'hire') !== false || strpos($message, 'partnership') !== false) {
            $category = 'Business / Career';
            $reply = "Dear {$contact->name},\n\nThank you for your interest in BDNSI.\n\nFor career or partnership inquiries, please forward your detailed proposal or CV to our official HR/Admin email. Our management team reviews all proposals and will get back to you if there is a mutual fit.\n\nBest regards,\nBDNSI Management";
        } else {
            $category = 'General Inquiry';
            $reply = "Dear {$contact->name},\n\nThank you for contacting Bangladesh National Skills Institute (BDNSI)!\n\nWe have received your message and our team is currently reviewing it. We will get back to you with a detailed response very soon. If your matter is urgent, feel free to call our official hotline number.\n\nThank you for your patience.\n\nBest regards,\nBDNSI Support Team";
        }

        // Add a slight delay to simulate "AI processing time" (e.g. 1.5 seconds)
        usleep(1500000);

        return response()->json([
            'success' => true,
            'source' => 'BDNSI Smart Assistant',
            'data' => [
                'category' => $category,
                'priority' => $priority,
                'suggested_reply' => $reply,
            ],
        ]);
    }
}
