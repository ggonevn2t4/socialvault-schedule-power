-- Create tasks table for project management
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID,
  created_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'overdue')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflows table for approval processes
CREATE TABLE public.workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]', -- Array of workflow steps
  created_by UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow instances for tracking specific workflow executions
CREATE TABLE public.workflow_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  team_id UUID NOT NULL,
  current_step INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'cancelled')),
  data JSONB DEFAULT '{}', -- Additional data for the workflow instance
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow approvals for tracking individual approvals
CREATE TABLE public.workflow_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_instance_id UUID REFERENCES public.workflow_instances(id) ON DELETE CASCADE NOT NULL,
  step_index INTEGER NOT NULL,
  approver_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_approvals ENABLE ROW LEVEL SECURITY;

-- RLS policies for tasks
CREATE POLICY "Team members can view tasks" 
ON public.tasks FOR SELECT 
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team members can create tasks" 
ON public.tasks FOR INSERT 
WITH CHECK (is_team_member(auth.uid(), team_id));

CREATE POLICY "Task assignees and admins can update tasks" 
ON public.tasks FOR UPDATE 
USING (
  is_team_member(auth.uid(), team_id) AND 
  (assignee_id = auth.uid() OR get_user_role(auth.uid(), team_id) = 'admin')
);

CREATE POLICY "Admins can delete tasks" 
ON public.tasks FOR DELETE 
USING (get_user_role(auth.uid(), team_id) = 'admin');

-- RLS policies for workflows
CREATE POLICY "Team members can view workflows" 
ON public.workflows FOR SELECT 
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Admins can manage workflows" 
ON public.workflows FOR ALL 
USING (get_user_role(auth.uid(), team_id) = 'admin');

-- RLS policies for workflow instances
CREATE POLICY "Team members can view workflow instances" 
ON public.workflow_instances FOR SELECT 
USING (is_team_member(auth.uid(), team_id));

CREATE POLICY "Team members can create workflow instances" 
ON public.workflow_instances FOR INSERT 
WITH CHECK (is_team_member(auth.uid(), team_id));

CREATE POLICY "Workflow participants can update instances" 
ON public.workflow_instances FOR UPDATE 
USING (is_team_member(auth.uid(), team_id));

-- RLS policies for workflow approvals
CREATE POLICY "Team members can view approvals" 
ON public.workflow_approvals FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.workflow_instances wi 
    WHERE wi.id = workflow_instance_id 
    AND is_team_member(auth.uid(), wi.team_id)
  )
);

CREATE POLICY "Approvers can manage their approvals" 
ON public.workflow_approvals FOR ALL 
USING (approver_id = auth.uid());

-- Create trigger for updating timestamps
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_instances_updated_at
  BEFORE UPDATE ON public.workflow_instances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();