<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProjectCreatedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $project;
    public $user;
    public $userGroup;

    /**
     * Create a new message instance.
     *
     * @param  $project
     * @param $user
     * @param $userGroup
     */
    public function __construct($project, $user, $userGroup)
    {
        $this->project = $project;
        $this->user = $user;
        $this->userGroup = $userGroup;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Project Created Notification'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.projectCreated'
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}